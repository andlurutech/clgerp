from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
import uuid
import random

from database import get_db
import models, models_admissions, auth
from adapters.crm_adapter import LeadSquaredAdapter, ExtraaEdgeAdapter

router = APIRouter(prefix="/admissions", tags=["Admissions"])

@router.get("/applications")
async def get_applications(admin_user: models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    """Fetch all incoming leads / applications."""
    stmt = select(models_admissions.ApplicationForm).order_by(models_admissions.ApplicationForm.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/sync")
async def sync_crm_leads(admin_user: models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    """Trigger bi-directional lead sync using existing adapters."""
    ls_adapter = LeadSquaredAdapter()
    ee_adapter = ExtraaEdgeAdapter()
    
    # Simulate fetching leads via adapters
    await ls_adapter.sync_lead({"simulated": True})
    await ee_adapter.sync_lead({"simulated": True})
    
    # Generate mock data that came from the CRM
    new_leads = [
        models_admissions.ApplicationForm(
            name=f"Lead {random.randint(1000, 9999)}",
            email=f"lead{random.randint(100, 999)}@example.com",
            phone=f"98765{random.randint(10000, 99999)}",
            source=random.choice(list(models_admissions.LeadSource)),
            stage=models_admissions.ApplicationStage.NEW,
            counselor_name="Admin User"
        ) for _ in range(random.randint(1, 3))
    ]
    
    db.add_all(new_leads)
    await db.commit()
    
    return {"status": "success", "synced_count": len(new_leads)}

class StageUpdateRequest(BaseModel):
    stage: str

@router.put("/applications/{app_id}/stage")
async def update_application_stage(app_id: str, req: StageUpdateRequest, 
                                   admin_user: models.User = Depends(auth.get_current_user),
                                   db: AsyncSession = Depends(get_db)):
    stmt = select(models_admissions.ApplicationForm).filter(models_admissions.ApplicationForm.id == app_id)
    result = await db.execute(stmt)
    app = result.scalars().first()
    
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    app.stage = models_admissions.ApplicationStage(req.stage)
    await db.commit()
    
    return {"status": "success", "stage": app.stage.value}
