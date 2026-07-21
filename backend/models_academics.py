import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from .database import Base

class RegistrationStatus(enum.Enum):
    SELECTED = "Selected"
    WAITLISTED = "Waitlisted"
    REGISTERED = "Registered"

class Term(Base):
    __tablename__ = "terms"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"))
    name = Column(String) # e.g. "Fall 2024"
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    is_active = Column(Boolean, default=True)

class CourseOffering(Base):
    __tablename__ = "course_offerings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"))
    term_id = Column(UUID(as_uuid=True), ForeignKey("terms.id"))
    capacity = Column(Integer, default=60)
    waitlist_capacity = Column(Integer, default=20)
    # Available seats tracked in Redis, but we keep DB field for fallback/sync
    available_seats = Column(Integer, default=60) 

class ClassGroup(Base):
    __tablename__ = "class_groups"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_offering_id = Column(UUID(as_uuid=True), ForeignKey("course_offerings.id"))
    name = Column(String) # e.g. "Section A"
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("users.id")) # Primary instructor

class CourseRegistration(Base):
    __tablename__ = "course_registrations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    course_offering_id = Column(UUID(as_uuid=True), ForeignKey("course_offerings.id"))
    status = Column(Enum(RegistrationStatus), default=RegistrationStatus.SELECTED)
    registered_at = Column(DateTime, default=datetime.utcnow)

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_group_id = Column(UUID(as_uuid=True), ForeignKey("class_groups.id"))
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    date = Column(DateTime)
    is_present = Column(Boolean, default=False)
