from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None
    pre_auth_token: Optional[str] = None
    detail: Optional[str] = None

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

class TwoFARequest(BaseModel):
    pre_auth_token: str
    otp: str

class RoleRead(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    permissions: List[str]

    class Config:
        from_attributes = True

class TenantRead(BaseModel):
    id: UUID
    name: str
    slug: str
    domain: Optional[str] = None
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    enabled_modules: List[str]

    class Config:
        from_attributes = True

class UserRead(BaseModel):
    id: UUID
    tenant_id: UUID
    role_id: Optional[UUID] = None
    username: str
    email: EmailStr
    phone_number: Optional[str] = None
    is_active: bool
    created_at: datetime
    role: Optional[RoleRead] = None
    tenant: Optional[TenantRead] = None

    class Config:
        from_attributes = True
