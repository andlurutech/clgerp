from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
import uuid

from database import get_db
import models, models_finance, auth
from core.security import limiter

router = APIRouter(prefix="/finance", tags=["Finance"])

class PaymentRequest(BaseModel):
    amount: int
    description: str = "Online Fee Payment"

@router.get("/ledger")
async def get_ledger(current_user: models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    """Fetch the student's ledger."""
    stmt = select(models_finance.StudentLedger).filter(models_finance.StudentLedger.student_id == current_user.id).order_by(models_finance.StudentLedger.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/pay")
async def process_payment(req: PaymentRequest, current_user: models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    """Mock payment gateway integration ensuring ledger consistency."""
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid payment amount")
        
    # Simulate processing payment...
    gateway_id = f"txn_{uuid.uuid4().hex[:12]}"
    
    # Create Payment Record in Ledger
    payment = models_finance.StudentLedger(
        student_id=current_user.id,
        transaction_type=models_finance.TransactionType.PAYMENT,
        amount=req.amount,
        description=req.description,
        gateway_transaction_id=gateway_id,
        is_synced_to_accounting=False
    )
    
    db.add(payment)
    await db.commit()
    
    return {"status": "success", "transaction_id": gateway_id, "amount": payment.amount}

from tasks.communications import send_fee_reminder_email

@router.post("/reminders/dispatch", status_code=202)
@limiter.limit("1/minute")
async def dispatch_reminders(
    request: Request,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Asynchronous Offloading: Dispatches fee reminders to all students with an outstanding balance.
    Returns 202 Accepted immediately.
    """
    # Quick async query to find students with balance
    # In a real app, this query would be more complex, calculating SUM of amounts for CHARGE and PAYMENT
    # For now, we mock fetching students that have outstanding charges
    stmt = select(models_finance.StudentLedger.student_id).filter(
        models_finance.StudentLedger.transaction_type == models_finance.TransactionType.CHARGE
    ).distinct()
    
    result = await db.execute(stmt)
    student_ids = result.scalars().all()
    
    count = 0
    for s_id in student_ids:
        # Strict Constraint: Pass scalar UUID string, NOT a SQLAlchemy object
        send_fee_reminder_email.delay(str(s_id))
        count += 1
        
    return {"message": f"Dispatching {count} reminders in the background"}
