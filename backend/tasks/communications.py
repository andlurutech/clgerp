import os
from celery.utils.log import get_task_logger
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.celery_app import celery_app
import models, models_finance

logger = get_task_logger(__name__)

# Fallback synchronous engine for Celery
db_url = os.getenv("DATABASE_URL", "postgresql://clgerp_user:clgerp_password@localhost:5432/clgerp_db")
sync_db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")

engine = create_engine(sync_db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@celery_app.task(name="send_fee_reminder_email")
def send_fee_reminder_email(user_id: str):
    """
    Synchronous Celery task to send fee reminder emails.
    """
    logger.info(f"Initiating fee reminder dispatch for user_id: {user_id}")
    
    db = SessionLocal()
    try:
        # Mock SMTP dispatch logic using standard logging
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            logger.error(f"User {user_id} not found. Aborting email dispatch.")
            return
            
        ledger = db.query(models_finance.StudentLedger).filter(models_finance.StudentLedger.student_id == user_id).first()
        if ledger and ledger.outstanding_balance > 0:
            logger.info(f"[SMTP DISPATCH] Sending payment reminder to {user.email}. Outstanding Balance: {ledger.outstanding_balance}")
        else:
            logger.info(f"No outstanding balance for {user.email}. Skipping email.")
            
    except Exception as e:
        logger.error(f"Failed to dispatch fee reminder for user {user_id}: {str(e)}")
        raise
    finally:
        db.close()
        logger.info(f"Closed synchronous database session for user_id: {user_id}")
