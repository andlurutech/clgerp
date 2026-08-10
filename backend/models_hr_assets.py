import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from database import Base

class HRProfile(Base):
    __tablename__ = "hr_profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    department = Column(String)
    designation = Column(String)
    date_of_joining = Column(DateTime)
    
class LeaveStatus(enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    leave_type = Column(String)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(Enum(LeaveStatus), default=LeaveStatus.PENDING)

class Asset(Base):
    __tablename__ = "assets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    name = Column(String)
    category = Column(String)
    specifications = Column(JSON)
    purchase_details = Column(JSON)
    is_allocated = Column(Boolean, default=False)

class AssetAllocation(Base):
    __tablename__ = "asset_allocations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    allocated_at = Column(DateTime, default=datetime.utcnow)
    returned_at = Column(DateTime, nullable=True)

