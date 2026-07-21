from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from database import get_db
import models, models_lms, models_academics, auth

router = APIRouter(prefix="/lms", tags=["LMS"])

@router.post("/content/upload")
def upload_content(class_group_id: str, title: str, url: str,
                  current_user: models.User = Depends(auth.RoleChecker(["Faculty", "Admin"])), 
                  db: Session = Depends(get_db)):
    
    # Strict Faculty Row Isolation
    if current_user.role.name == "Faculty":
        cg = db.query(models_academics.ClassGroup).filter(
            models_academics.ClassGroup.id == class_group_id,
            models_academics.ClassGroup.faculty_id == current_user.id
        ).first()
        if not cg:
            raise HTTPException(status_code=403, detail="Not assigned to this ClassGroup")
            
    content = models_lms.CourseContent(class_group_id=class_group_id, title=title, content_url=url)
    db.add(content)
    db.commit()
    return {"message": "Content uploaded successfully"}

@router.post("/assessments/submit")
def submit_assessment(submission_id: str, answers: dict, 
                     current_user: models.User = Depends(auth.get_current_user), 
                     db: Session = Depends(get_db)):
    
    submission = db.query(models_lms.AssessmentSubmission).filter(
        models_lms.AssessmentSubmission.id == submission_id,
        models_lms.AssessmentSubmission.student_id == current_user.id
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission session not found")
        
    assessment = db.query(models_lms.Assessment).filter(models_lms.Assessment.id == submission.assessment_id).first()
    
    # Server-Enforced Quiz Deadlines
    now = datetime.utcnow()
    deadline = submission.started_at + timedelta(seconds=assessment.duration_seconds + 30) # 30s grace period
    
    if now > deadline:
        raise HTTPException(status_code=400, detail="Submission deadline exceeded")
        
    submission.answers = answers
    
    # Auto-scoring mock logic
    submission.auto_score = 85 
    
    db.commit()
    return {"message": "Assessment submitted successfully", "score": submission.auto_score}
