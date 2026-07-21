from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid
import os
import shutil

from database import get_db
import models, models_drive, auth

router = APIRouter(prefix="/drive", tags=["Drive"])

ALLOWED_TYPES = [
    "application/pdf", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
    "image/jpeg", 
    "image/png"
]

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Secure file upload pipeline with local storage adapter and quota check."""
    
    # File Type Sanitization
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported Media Type. Only PDF, DOCX, JPG, and PNG are allowed.")
    
    # Read the file to determine size
    file_bytes = await file.read()
    file_size = len(file_bytes)
    await file.seek(0) # Reset pointer
    
    # Lazy initialize PersonalDrive
    stmt = select(models_drive.PersonalDrive).with_for_update().filter(models_drive.PersonalDrive.user_id == current_user.id)
    result = await db.execute(stmt)
    drive_quota = result.scalars().first()
    
    if not drive_quota:
        drive_quota = models_drive.PersonalDrive(user_id=current_user.id)
        db.add(drive_quota)
    
    # Quota Enforcement
    if drive_quota.used_storage_bytes + file_size > drive_quota.quota_bytes:
        raise HTTPException(status_code=413, detail="Payload Too Large. Storage quota exceeded.")
        
    # Local Storage Adapter
    upload_dir = os.path.join(os.getcwd(), "uploads", str(current_user.id))
    os.makedirs(upload_dir, exist_ok=True)
    
    safe_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(upload_dir, safe_filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)
        
    # Update Quota and Metadata
    drive_quota.used_storage_bytes += file_size
    
    doc = models_drive.DriveDocument(
        user_id=current_user.id,
        folder_id=None,
        name=file.filename,
        file_size=file_size,
        mime_type=file.content_type,
        s3_key=file_path # Local path acting as S3 key for now
    )
    db.add(doc)
    await db.commit()
    
    return {"message": "Document uploaded successfully", "doc_id": str(doc.id)}

@router.get("/files")
async def get_drive_files(
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # RBAC Fetching
    stmt_docs = select(models_drive.DriveDocument).filter(models_drive.DriveDocument.user_id == current_user.id).order_by(models_drive.DriveDocument.created_at.desc())
    docs = (await db.execute(stmt_docs)).scalars().all()
    
    stmt_quota = select(models_drive.PersonalDrive).filter(models_drive.PersonalDrive.user_id == current_user.id)
    quota = (await db.execute(stmt_quota)).scalars().first()
    
    if not quota:
        # Lazy init if just fetching
        quota = models_drive.PersonalDrive(user_id=current_user.id)
        db.add(quota)
        await db.commit()
        await db.refresh(quota)
        
    return {
        "quota": {
            "used_bytes": quota.used_storage_bytes,
            "total_bytes": quota.quota_bytes
        },
        "files": [
            {
                "id": str(d.id),
                "name": d.name,
                "file_size": d.file_size,
                "mime_type": d.mime_type,
                "created_at": d.created_at
            } for d in docs
        ]
    }
