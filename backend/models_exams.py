import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from .database import Base

class GradingType(enum.Enum):
    ABSOLUTE = "Absolute"
    RELATIVE = "Relative"

class GradingSchema(Base):
    __tablename__ = "grading_schemas"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"))
    grading_type = Column(Enum(GradingType), default=GradingType.ABSOLUTE)
    internal_weight = Column(Integer, default=50)
    external_weight = Column(Integer, default=50)

class UnifiedGradeBook(Base):
    __tablename__ = "unified_grade_book"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"))
    term_id = Column(UUID(as_uuid=True), ForeignKey("terms.id"))
    total_score = Column(Integer)
    letter_grade = Column(String)
    is_published = Column(Boolean, default=False)

class GradeAuditLog(Base):
    __tablename__ = "grade_audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    grade_book_id = Column(UUID(as_uuid=True), ForeignKey("unified_grade_book.id"))
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    previous_grade = Column(String)
    new_grade = Column(String)
    reason = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AnswerSheetMask(Base):
    __tablename__ = "answer_sheet_masks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"))
    evaluation_token = Column(String, unique=True) # Anonymous token for faculty grading
