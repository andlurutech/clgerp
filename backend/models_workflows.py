import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from database import Base

class GatePassType(enum.Enum):
    DAY_OUT = "DayOut"
    NIGHT_OUT = "NightOut"

class GatePassStatus(enum.Enum):
    PENDING = "Pending"
    PARENT_APPROVED = "ParentApproved"
    WARDEN_APPROVED = "WardenApproved"
    REJECTED = "Rejected"

class GatePassRequest(Base):
    __tablename__ = "gate_pass_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    pass_type = Column(Enum(GatePassType))
    destination = Column(String)
    requested_out_time = Column(DateTime)
    requested_in_time = Column(DateTime)
    status = Column(Enum(GatePassStatus), default=GatePassStatus.PENDING)
    parent_approval_token = Column(String, nullable=True) # Cryptographic one-time token

class BiometricLog(Base):
    __tablename__ = "biometric_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    device_id = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_entry = Column(Boolean) # True for Entry, False for Exit
