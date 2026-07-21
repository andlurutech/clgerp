from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import pyotp
import uuid

from database import get_db
import models, models_infrastructure, models_finance, auth

router = APIRouter(prefix="/infrastructure", tags=["Infrastructure"])

# In production, each user would have a securely stored base32 secret
# For demo purposes, using a fixed base secret mapped to user_id
def get_user_totp_secret(user_id: str):
    # Padding user_id to base32 requirement length
    return str(user_id).replace("-", "").upper()[:32].ljust(32, "A")

from pydantic import BaseModel
from datetime import date
from sqlalchemy import cast, Date

class VerifyMealRequest(BaseModel):
    user_id: str
    totp_code: str

@router.post("/canteen/verify-meal")
async def verify_meal_code(req: VerifyMealRequest, db: AsyncSession = Depends(get_db)):
    """Rotating Canteen QR Codes (Anti-Spoofing): TOTP verification with Double-Dip Prevention."""
    secret = get_user_totp_secret(req.user_id)
    totp = pyotp.TOTP(secret, interval=30) # 30 second expiry
    
    if not totp.verify(req.totp_code):
        raise HTTPException(status_code=400, detail="Invalid or expired meal code")
        
    # Double-Dip Prevention
    today = date.today()
    stmt = select(models_infrastructure.MealConsumption).filter(
        models_infrastructure.MealConsumption.student_id == req.user_id,
        cast(models_infrastructure.MealConsumption.consumed_at, Date) == today
    )
    result = await db.execute(stmt)
    already_eaten = result.scalars().first()
    
    if already_eaten:
        raise HTTPException(status_code=400, detail="Meal Already Eaten (Double-Dip Prevented)")
        
    consumption = models_infrastructure.MealConsumption(
        student_id=req.user_id,
        meal_type="Lunch"
    )
    db.add(consumption)
    await db.commit()
    return {"message": "Meal verified and logged successfully", "user_id": req.user_id}

@router.get("/canteen/me")
async def get_canteen_me(current_user: models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    secret = get_user_totp_secret(current_user.id)
    
    stmt = select(models_infrastructure.CanteenMenu).filter(models_infrastructure.CanteenMenu.meal_type == "Lunch")
    result = await db.execute(stmt)
    menu = result.scalars().first()
    
    if not menu:
        menu = models_infrastructure.CanteenMenu(meal_type="Lunch", items="Paneer Butter Masala, Roti, Rice, Dal")
        db.add(menu)
        await db.commit()
        await db.refresh(menu)
        
    return {
        "user_id": str(current_user.id),
        "totp_secret": secret,
        "active_menu": menu.items
    }

@router.post("/hostel/allot")
async def allot_hostel_room(student_id: str, room_id: str, 
                           admin_user: models.User = Depends(auth.PermissionChecker("infrastructure:allot")),
                           db: AsyncSession = Depends(get_db)):
    """Ledger Transaction Atomic Commits: Wrap Allotment + Ledger update in one transaction."""
    
    # Verify room exists and capacity
    stmt = select(models_infrastructure.HostelRoom).with_for_update().filter(models_infrastructure.HostelRoom.id == room_id)
    result = await db.execute(stmt)
    room = result.scalars().first()
    
    if not room or room.occupied >= room.capacity:
        raise HTTPException(status_code=400, detail="Room is full or does not exist")
        
    try:
        # Atomic Transaction wrapping both operations
        room.occupied += 1
        
        allotment = models_infrastructure.HostelAllotment(
            student_id=student_id,
            room_id=room_id,
            status=models_infrastructure.AllotmentStatus.CONFIRMED
        )
        db.add(allotment)
        
        # Tie into Phase 2 StudentLedger
        ledger_entry = models_finance.StudentLedger(
            student_id=student_id,
            transaction_type=models_finance.TransactionType.CHARGE,
            amount=50000, # e.g. 50,000 Hostel Fee
            description="Hostel Fee Allotment Charge",
            gateway_transaction_id=f"SYS-{uuid.uuid4()}"
        )
        db.add(ledger_entry)
        
        await db.commit()
        return {"message": "Hostel room allotted and ledger updated atomically."}
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Transaction failed, rolled back.")
