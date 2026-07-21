import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from .database import Base

class DriveFolder(Base):
    __tablename__ = "drive_folders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    parent_id = Column(UUID(as_uuid=True), ForeignKey("drive_folders.id"), nullable=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class DriveDocument(Base):
    __tablename__ = "drive_documents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    folder_id = Column(UUID(as_uuid=True), ForeignKey("drive_folders.id"), nullable=True)
    name = Column(String)
    file_size = Column(Integer)
    mime_type = Column(String)
    s3_key = Column(String)
    tags = Column(String) # Comma separated
    created_at = Column(DateTime, default=datetime.utcnow)

class PersonalDrive(Base):
    __tablename__ = "personal_drives"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    used_storage_bytes = Column(Integer, default=0)
    quota_bytes = Column(Integer, default=52428800) # 50MB default
