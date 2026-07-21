import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from .database import Base

class QuestionType(enum.Enum):
    MCQ = "MCQ"
    SCQ = "SCQ"
    FILL_IN_BLANK = "FIB"
    SUBJECTIVE = "Subjective"

class CourseContent(Base):
    __tablename__ = "course_contents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_group_id = Column(UUID(as_uuid=True), ForeignKey("class_groups.id"))
    title = Column(String)
    content_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_group_id = Column(UUID(as_uuid=True), ForeignKey("class_groups.id"))
    title = Column(String)
    description = Column(String)
    due_date = Column(DateTime)
    rubric = Column(JSON) # Definition of grading criteria

class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assignment_id = Column(UUID(as_uuid=True), ForeignKey("assignments.id"))
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    submission_url = Column(String)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    graded_score = Column(Integer, nullable=True)

class QuestionBank(Base):
    __tablename__ = "question_bank"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"))
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    question_type = Column(Enum(QuestionType))
    content = Column(JSON) # { "text": "...", "options": [...], "answer": "..." }
    co_mapping = Column(String) # Course Outcome (e.g. CO1)
    bt_level = Column(String) # Bloom's Taxonomy Level (e.g. L1)

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_group_id = Column(UUID(as_uuid=True), ForeignKey("class_groups.id"))
    title = Column(String)
    start_time = Column(DateTime)
    duration_seconds = Column(Integer)
    configuration = Column(JSON) # e.g. { "mcq_count": 10, "co_mapping": ["CO1", "CO2"] }

class AssessmentSubmission(Base):
    __tablename__ = "assessment_submissions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"))
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    started_at = Column(DateTime, default=datetime.utcnow)
    answers = Column(JSON) # Submitted answers
    auto_score = Column(Integer, nullable=True)
