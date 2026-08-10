from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from database import get_db
import auth
import models
from services.entitlements import get_effective_entitlements

router = APIRouter(prefix="/platform", tags=["platform"])

@router.get("/capabilities")
async def get_capabilities(
    current_tenant: models.Tenant = Depends(auth.get_current_tenant),
    current_user: models.User = Depends(auth.get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns the effective entitlements and capabilities for the current tenant.
    Frontend can use this to dynamically construct the white-label product experience.
    """
    entitlements = await get_effective_entitlements(db, current_tenant.id)
    
    return {
        "tenant": {
            "name": current_tenant.name,
            "domain": current_tenant.domain,
            "theme": {
                "logo_url": current_tenant.logo_url,
                "primary_color": current_tenant.primary_color,
                "secondary_color": current_tenant.secondary_color
            },
            "mfa_policy": current_tenant.mfa_requirement
        },
        "user": {
            "id": str(current_user.id),
            "role": current_user.role.name if current_user.role else "Student",
            "mfa_enabled": current_user.mfa_enabled
        },
        "features": entitlements
    }
