from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models, models_exams, auth

router = APIRouter(prefix="/exams", tags=["Exams"])

@router.post("/publish-results")
def publish_results(term_id: str, 
                   admin_user: models.User = Depends(auth.PermissionChecker("exams:publish_results")), 
                   db: Session = Depends(get_db)):
    # Mock logic to publish grades
    gradebooks = db.query(models_exams.UnifiedGradeBook).filter(
        models_exams.UnifiedGradeBook.term_id == term_id
    ).all()
    
    for gb in gradebooks:
        gb.is_published = True
        
    db.commit()
    return {"message": f"Results published for term {term_id}"}

@router.patch("/grade-override")
def grade_override(grade_book_id: str, new_grade: str, reason: str,
                  admin_user: models.User = Depends(auth.PermissionChecker("academics:grade_override")), 
                  db: Session = Depends(get_db)):
                  
    gb = db.query(models_exams.UnifiedGradeBook).filter(models_exams.UnifiedGradeBook.id == grade_book_id).first()
    if not gb:
        raise HTTPException(status_code=404, detail="Grade book record not found")
        
    if not gb.is_published:
        raise HTTPException(status_code=400, detail="Cannot override unpublished grades directly via this endpoint")
        
    # Immutable Grade Audit Logging
    audit_log = models_exams.GradeAuditLog(
        grade_book_id=gb.id,
        admin_id=admin_user.id,
        previous_grade=gb.letter_grade,
        new_grade=new_grade,
        reason=reason
    )
    
    gb.letter_grade = new_grade
    db.add(audit_log)
    db.commit()
    
    return {"message": "Grade overridden successfully, audit log created"}
