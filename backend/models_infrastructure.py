import uuid
from sqlalchemy import Column, String, ForeignKey, Integer, Enum, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from .database import Base

class HostelBlock(Base):
    __tablename__ = "hostel_blocks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    gender_type = Column(String)

class HostelRoom(Base):
    __tablename__ = "hostel_rooms"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    block_id = Column(UUID(as_uuid=True), ForeignKey("hostel_blocks.id"))
    room_number = Column(String)
    capacity = Column(Integer)
    occupied = Column(Integer, default=0)

class AllotmentStatus(enum.Enum):
    PROVISIONAL = "Provisional"
    CONFIRMED = "Confirmed"

class HostelAllotment(Base):
    __tablename__ = "hostel_allotments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    room_id = Column(UUID(as_uuid=True), ForeignKey("hostel_rooms.id"))
    status = Column(Enum(AllotmentStatus), default=AllotmentStatus.PROVISIONAL)

class MaintenanceTicket(Base):
    __tablename__ = "maintenance_tickets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    category = Column(String) # e.g. Housekeeping, Internet, Plumbing
    description = Column(String)
    is_resolved = Column(Boolean, default=False)

class CanteenMenu(Base):
    __tablename__ = "canteen_menus"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_type = Column(String) # Breakfast, Lunch, Dinner
    items = Column(String)

class MealConsumption(Base):
    __tablename__ = "meal_consumptions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    meal_type = Column(String)
    consumed_at = Column(DateTime, default=datetime.utcnow)

class TransportRoute(Base):
    __tablename__ = "transport_routes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_name = Column(String)
    pickup_point = Column(String)
    fee_amount = Column(Integer)
