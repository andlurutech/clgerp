from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db, redis_client
import models, models_academics, auth

router = APIRouter(prefix="/academics", tags=["Academics"])

@router.post("/registration/bulk")
def register_courses(course_offering_ids: list[str], 
                    current_user: models.User = Depends(auth.get_current_user), 
                    db: Session = Depends(get_db)):
    """High-concurrency registration endpoint supporting Selection and Waitlisting."""
    
    results = []
    
    for offering_id in course_offering_ids:
        # Atomic Seat Reservation using row-level locking
        offering = db.query(models_academics.CourseOffering).with_for_update().filter(
            models_academics.CourseOffering.id == offering_id
        ).first()
        
        if not offering:
            results.append({"offering_id": offering_id, "status": "Failed", "reason": "Not found"})
            continue
            
        # Check if already registered
        existing = db.query(models_academics.CourseRegistration).filter(
            models_academics.CourseRegistration.student_id == current_user.id,
            models_academics.CourseRegistration.course_offering_id == offering_id
        ).first()
        
        if existing:
            results.append({"offering_id": offering_id, "status": "Failed", "reason": "Already registered/waitlisted"})
            continue
            
        if offering.available_seats > 0:
            offering.available_seats -= 1
            reg_status = models_academics.RegistrationStatus.REGISTERED
        elif offering.waitlist_capacity > 0:
            # Simple waitlist decrement logic for demonstration
            offering.waitlist_capacity -= 1
            reg_status = models_academics.RegistrationStatus.WAITLISTED
        else:
            results.append({"offering_id": offering_id, "status": "Failed", "reason": "Capacity full"})
            continue
            
        registration = models_academics.CourseRegistration(
            student_id=current_user.id,
            course_offering_id=offering.id,
            status=reg_status
        )
        db.add(registration)
        db.commit()
        
        results.append({"offering_id": offering_id, "status": reg_status.value})
        
    return {"message": "Bulk registration processed", "results": results}
