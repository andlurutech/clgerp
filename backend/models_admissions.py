import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import enum

from database import Base

class ApplicationStage(enum.Enum):
    NEW = "New"
    DOCUMENT_VERIFICATION_PENDING = "Document Verification Pending"
    FEE_PAID = "Fee Paid"
    ENROLLED = "Enrolled"
    REJECTED = "Rejected"

class LeadSource(enum.Enum):
    LEADSQUARED = "LeadSquared"
    NPF = "NPF"
    EXTRAAEDGE = "ExtraaEdge"
    ORGANIC = "Organic"

class ApplicationForm(Base):
    __tablename__ = "application_forms"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    source = Column(Enum(LeadSource), default=LeadSource.ORGANIC)
    stage = Column(Enum(ApplicationStage), default=ApplicationStage.NEW)
    counselor_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
