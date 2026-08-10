import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from database import Base

class Post(Base):
    __tablename__ = "community_posts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    content = Column(String)
    media_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class EngagementType(enum.Enum):
    UPVOTE = "Upvote"
    COMMENT = "Comment"
    RESHARE = "Reshare"

class Engagement(Base):
    __tablename__ = "community_engagements"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    post_id = Column(UUID(as_uuid=True), ForeignKey("community_posts.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    engagement_type = Column(Enum(EngagementType))
    content = Column(String, nullable=True) # for comments

class EventNotice(Base):
    __tablename__ = "event_notices"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    title = Column(String)
    description = Column(String)
    cover_image_url = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    venue = Column(String)
    speaker = Column(String)

class NoticeAcknowledgement(Base):
    __tablename__ = "notice_acknowledgements"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)
    notice_id = Column(UUID(as_uuid=True), ForeignKey("event_notices.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    viewed_at = Column(DateTime, default=datetime.utcnow)
