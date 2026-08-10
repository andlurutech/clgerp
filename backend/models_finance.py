import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from database import Base

class TransactionType(enum.Enum):
    CHARGE = "Charge"
    PAYMENT = "Payment"

class StudentLedger(Base):
    __tablename__ = "student_ledger"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    transaction_type = Column(Enum(TransactionType))
    amount = Column(Integer)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    gateway_transaction_id = Column(String, unique=True, nullable=True) # Webhook idempotency key
    
    # Financial Integrations Idempotency
    is_synced_to_accounting = Column(Boolean, default=False)
    synced_at = Column(DateTime, nullable=True)
