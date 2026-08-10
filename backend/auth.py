import random
from datetime import datetime, timedelta
from typing import Optional, List
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from database import get_db, redis_client
import models
from config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

SECRET_KEY = getattr(settings, "jwt_secret", "fallback_secret_key_for_dev_only")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
PRE_AUTH_EXPIRE_MINUTES = 5

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    return create_access_token(data, expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))

def generate_otp():
    return f"{random.randint(100000, 999999)}"

def send_sms_otp(phone_number: str, otp: str):
    # Mock SMS logic
    print(f"Sending OTP {otp} to {phone_number}")

async def get_user(db: AsyncSession, username_or_email: str):
    stmt = select(models.User).options(selectinload(models.User.role), selectinload(models.User.tenant)).filter(
        (models.User.username == username_or_email) | (models.User.email == username_or_email)
    )
    result = await db.execute(stmt)
    return result.scalars().first()

async def get_current_tenant(request: Request, db: AsyncSession = Depends(get_db)) -> models.Tenant:
    host = request.headers.get("host", "")
    if ":" in host:
        host = host.split(":")[0]
    
    if not host:
        raise HTTPException(status_code=400, detail="Host header missing")
        
    stmt = select(models.Tenant).filter(models.Tenant.domain == host)
    result = await db.execute(stmt)
    tenant = result.scalars().first()
    
    if not tenant:
        if settings.app_env == "development" and settings.default_dev_tenant:
            # Fallback to dev tenant
            dev_stmt = select(models.Tenant).filter(models.Tenant.slug == settings.default_dev_tenant)
            dev_res = await db.execute(dev_stmt)
            tenant = dev_res.scalars().first()
            if not tenant:
                raise HTTPException(status_code=404, detail="Tenant not found")
        else:
            raise HTTPException(status_code=404, detail="Tenant not found")
            
    if tenant.status != "active":
        raise HTTPException(status_code=403, detail="Tenant is suspended or inactive")
        
    return tenant

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: AsyncSession = Depends(get_db),
    current_tenant: models.Tenant = Depends(get_current_tenant)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = await get_user(db, username)
    if user is None:
        raise credentials_exception
        
    if user.tenant_id != current_tenant.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Cross-tenant token replay denied"
        )
        
    return user

def is_mfa_required(tenant: models.Tenant, user: models.User) -> bool:
    """Evaluates if MFA is required based on Tenant policy and User role."""
    policy = tenant.mfa_requirement
    
    if policy == "NONE":
        return False
        
    if policy == "ALL":
        return True
        
    if policy == "STAFF_ONLY":
        if not user.role:
            return False # E.g. Students
        # Assume specific roles or permissions indicate staff
        staff_roles = ["admin", "faculty", "staff", "accountant", "hr", "librarian"]
        if user.role.name.lower() in staff_roles:
            return True
        return False

    return False

def RoleChecker(allowed_roles: List[str]):
    async def role_checker(current_user: models.User = Depends(get_current_user)):
        if not current_user.role or current_user.role.name not in allowed_roles:
            raise HTTPException(status_code=403, detail="Operation not permitted for this role")
        return current_user
    return role_checker

def PermissionChecker(required_permission: str):
    async def permission_checker(current_user: models.User = Depends(get_current_user)):
        if not current_user.role or not current_user.role.permissions:
            raise HTTPException(status_code=403, detail="Operation not permitted")
        if required_permission not in current_user.role.permissions and "admin.all" not in current_user.role.permissions:
            raise HTTPException(status_code=403, detail="Operation not permitted")
        return current_user
    return permission_checker
