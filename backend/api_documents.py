import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import segno
import base64
from datetime import datetime

from database import get_db
import models, models_exams, auth
from config import settings
from services.pdf_generator import generate_pdf

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("/id-card/{user_id}")
async def download_id_card(
    user_id: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Determine the target user
    # In a real system, verify RBAC if user_id != current_user.username/id
    target_username = user_id
    if user_id == "me":
        target_username = current_user.username
        
    stmt = select(models.User).filter(models.User.username == target_username)
    result = await db.execute(stmt)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Generate QR Code payload
    qr = segno.make_qr(f"{user.id}:{user.username}")
    out = io.BytesIO()
    qr.save(out, kind='svg')
    qr_base64 = base64.b64encode(out.getvalue()).decode('utf-8')
    
    role_name = user.role.name if user.role else "STUDENT"
    
    context = {
        "user": user,
        "role_name": role_name,
        "institution_name": settings.institution_name,
        "primary_color": "#7c3aed", # Matching the white-label theme
        "qr_base64": qr_base64
    }
    
    try:
        pdf_bytes = await generate_pdf("id_card.html", context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
        
    return StreamingResponse(
        io.BytesIO(pdf_bytes), 
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=ID_Card_{user.username}.pdf"}
    )

@router.get("/transcript/{user_id}")
async def download_transcript(
    user_id: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    target_username = user_id
    if user_id == "me":
        target_username = current_user.username
        
    stmt = select(models.User).filter(models.User.username == target_username)
    user = (await db.execute(stmt)).scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Fetch AcademicRecord rows (using UnifiedGradeBook)
    stmt_grades = select(models_exams.UnifiedGradeBook).filter(models_exams.UnifiedGradeBook.student_id == user.id)
    records = (await db.execute(stmt_grades)).scalars().all()
    
    # Dynamically calculate CGPA
    # Map letter grades to points
    points_map = {"A": 4.0, "B": 3.0, "C": 2.0, "D": 1.0, "F": 0.0}
    total_points = 0.0
    total_credits = 0
    
    for r in records:
        grade = r.letter_grade or "B" # Fallback for mock data
        pts = points_map.get(grade, 3.0)
        credits = 4 # Mocking 4 credits per course
        total_points += pts * credits
        total_credits += credits
        
    cgpa = round(total_points / total_credits, 2) if total_credits > 0 else 0.0
    
    # If no records, mock a CGPA for demonstration of the template
    if not records:
        cgpa = 3.75
        
    context = {
        "user": user,
        "records": records,
        "cgpa": cgpa,
        "institution_name": settings.institution_name,
        "primary_color": "#7c3aed",
        "date": datetime.now().strftime("%B %d, %Y")
    }
    
    try:
        pdf_bytes = await generate_pdf("transcript.html", context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
        
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Transcript_{user.username}.pdf"}
    )
