from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import hmac
import hashlib
import os

from database import get_db
import models, models_placements, auth

router = APIRouter(prefix="/placements", tags=["Placements"])

CERT_SECRET = os.getenv("CERT_SECRET", "super_secret_salt")

@router.get("/applications")
async def get_applications(current_user: models.User = Depends(auth.get_current_user), db: AsyncSession = Depends(get_db)):
    """Placement Data Privacy: Strict row-level security."""
    
    # If student, only see own applications
    if current_user.role and current_user.role.name == "Student":
        stmt = select(models_placements.PlacementApplication).filter(models_placements.PlacementApplication.student_id == current_user.id)
    else:
        # Admins can see all
        stmt = select(models_placements.PlacementApplication)
        
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/certificates/issue")
async def issue_certificate(student_id: str, template_name: str, 
                           admin_user: models.User = Depends(auth.PermissionChecker("placements:issue_cert")),
                           db: AsyncSession = Depends(get_db)):
    
    # Generate sequential serial (simplified for demo)
    serial = f"CERT-{student_id[:8].upper()}-001"
    
    # Cryptographic Certificate Hashes (HMAC-SHA256)
    message = f"{student_id}:{template_name}:{serial}".encode('utf-8')
    qr_hash = hmac.new(CERT_SECRET.encode('utf-8'), message, hashlib.sha256).hexdigest()
    
    cert = models_placements.IssuedCertificate(
        student_id=student_id,
        template_name=template_name,
        serial_number=serial,
        qr_hash=qr_hash
    )
    
    db.add(cert)
    await db.commit()
    
    return {"message": "Certificate issued", "qr_hash": qr_hash, "serial_number": serial}

@router.get("/certificates/verify/{qr_hash}")
async def verify_certificate(qr_hash: str, db: AsyncSession = Depends(get_db)):
    stmt = select(models_placements.IssuedCertificate).filter(models_placements.IssuedCertificate.qr_hash == qr_hash)
    result = await db.execute(stmt)
    cert = result.scalars().first()
    
    if not cert:
        raise HTTPException(status_code=404, detail="Invalid or forged certificate QR hash")
        
    return {"valid": True, "serial_number": cert.serial_number, "template": cert.template_name}

from pydantic import BaseModel

class StageUpdateRequest(BaseModel):
    stage: str

@router.put("/applications/{app_id}/stage")
async def update_application_stage(app_id: str, req: StageUpdateRequest, 
                                   admin_user: models.User = Depends(auth.get_current_user),
                                   db: AsyncSession = Depends(get_db)):
    stmt = select(models_placements.PlacementApplication).filter(models_placements.PlacementApplication.id == app_id)
    result = await db.execute(stmt)
    app = result.scalars().first()
    
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    app.stage = models_placements.ApplicationStage(req.stage)
    await db.commit()
    
    return {"status": "success", "stage": app.stage.value}
