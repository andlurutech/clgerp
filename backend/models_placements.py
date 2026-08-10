import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from database import Base

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    industry = Column(String)
    hr_contact = Column(String)

class PlacementOpportunity(Base):
    __tablename__ = "placement_opportunities"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    title = Column(String)
    description = Column(String)
    eligibility_cgpa = Column(Integer) # scaled by 10 e.g. 75 for 7.5

class ApplicationStage(enum.Enum):
    APPLIED = "Applied"
    APTITUDE = "Aptitude"
    HR_ROUND = "HR Round"
    FINAL_ROUND = "Final Round"
    HIRED = "Hired"
    REJECTED = "Rejected"

class PlacementApplication(Base):
    __tablename__ = "placement_applications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    opportunity_id = Column(UUID(as_uuid=True), ForeignKey("placement_opportunities.id"))
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    stage = Column(Enum(ApplicationStage), default=ApplicationStage.APPLIED)

class IssuedCertificate(Base):
    __tablename__ = "issued_certificates"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    template_name = Column(String)
    serial_number = Column(String, unique=True)
    qr_hash = Column(String, unique=True) # HMAC-SHA256 hash for secure verification

class ResearchProject(Base):
    __tablename__ = "research_projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String)
    funding_agency = Column(String)
    amount_granted = Column(Integer)
