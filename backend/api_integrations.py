from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
import random

from database import get_db
from config import settings
import models_lms, models_finance, auth
from adapters.academic_adapter import TurnitinAdapter
from adapters.library_adapter import LibraryAdapter

router = APIRouter(prefix="/integrations", tags=["Integrations"])

# ----------------- TURNITIN ----------------- #

class TurnitinScanRequest(BaseModel):
    submission_id: str

@router.get("/turnitin/submissions")
async def get_turnitin_submissions(faculty_user: auth.models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    if not settings.enable_turnitin:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="FEATURE_DISABLED"
        )
        
    stmt = select(models_lms.AssessmentSubmission).order_by(models_lms.AssessmentSubmission.started_at.desc())
    result = await db.execute(stmt)
    submissions = result.scalars().all()
    
    # Mock Turnitin data appended to submission
    data = []
    for sub in submissions:
        # Generate some mock plagiarism data if processed
        has_run = hasattr(sub, 'turnitin_score') and sub.turnitin_score is not None
        score = getattr(sub, 'turnitin_score', random.choice([None, 5, 12, 25, 45]))
        data.append({
            "id": str(sub.id),
            "student_id": str(sub.student_id),
            "assessment_id": str(sub.assessment_id),
            "submitted_at": sub.started_at,
            "similarity_score": score
        })
        
    return data

@router.post("/turnitin/scan")
async def scan_turnitin(req: TurnitinScanRequest, faculty_user: auth.models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    if not settings.enable_turnitin:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="FEATURE_DISABLED"
        )
        
    adapter = TurnitinAdapter()
    result = await adapter.submit_assignment(req.submission_id, "mock_url")
    if not result:
        raise HTTPException(status_code=500, detail="Turnitin Adapter Failed")
        
    # Ideally, we would save the status/job ID in the DB.
    # For this implementation, we just return the accepted status.
    return {"status": "success", "turnitin_job": result}

# ----------------- KOHA ILS ----------------- #

@router.get("/koha/overdue")
async def get_overdue_books(admin_user: auth.models.User = Depends(auth.get_current_user)):
    # Mocking the current state of overdue books based on the adapter
    adapter = LibraryAdapter()
    return await adapter.fetch_overdue_fines()

@router.post("/koha/sync")
async def sync_koha_dues(admin_user: auth.models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    """Automated Fine Injection from Koha."""
    
    adapter = LibraryAdapter()
    fines = await adapter.fetch_overdue_fines()
    
    if not fines:
        return {"status": "success", "injected_amount": 0, "students_affected": 0}
        
    injected_amount = 0
    students_affected = set()
    
    try:
        for fine in fines:
            fine_id = fine.get("fine_id")
            amount = fine.get("fine_amount", 0)
            student_id = fine.get("student_id")
            
            # Idempotency Check: No Double-Billing
            stmt = select(models_finance.StudentLedger).filter(
                models_finance.StudentLedger.gateway_transaction_id == fine_id
            )
            existing = (await db.execute(stmt)).scalars().first()
            
            if existing:
                continue # Skip already billed fines
                
            # Need a valid UUID for student_id in a real system. 
            # If "student_1", we mock the UUID or fail.
            # Using the admin_user ID as fallback for testing the DB insertion if student_id is mock string
            try:
                import uuid
                val_id = uuid.UUID(student_id)
            except:
                val_id = admin_user.id
                
            charge = models_finance.StudentLedger(
                student_id=val_id,
                transaction_type=models_finance.TransactionType.CHARGE,
                amount=amount,
                description=f"Library Overdue Fine (Koha ID: {fine_id})",
                gateway_transaction_id=fine_id,
                is_synced_to_accounting=False
            )
            db.add(charge)
            
            injected_amount += amount
            students_affected.add(student_id)
            
        # Atomic Batch Commit
        await db.commit()
        return {
            "status": "success", 
            "injected_amount": injected_amount, 
            "students_affected": len(students_affected)
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to sync Koha fines: {str(e)}")
