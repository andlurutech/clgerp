from typing import Dict, Any, Optional, List
from fastapi import Request, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from database import get_db
import models
import models_entitlements
from auth import get_current_tenant, get_current_user

async def get_effective_entitlements(db: AsyncSession, tenant_id: str) -> Dict[str, Dict[str, Any]]:
    """
    Resolves: Plan Features + Tenant Overrides = Effective Entitlements
    Returns a dictionary of feature_key -> {enabled: bool, config: dict}
    """
    # 1. Get active subscription and its plan features
    sub_stmt = select(models_entitlements.Subscription).options(
        selectinload(models_entitlements.Subscription.plan).selectinload(models_entitlements.SubscriptionPlan.plan_features).selectinload(models_entitlements.PlanFeature.feature)
    ).filter(
        models_entitlements.Subscription.tenant_id == tenant_id,
        models_entitlements.Subscription.status == "active"
    )
    sub_result = await db.execute(sub_stmt)
    subscription = sub_result.scalars().first()
    
    entitlements = {}
    
    # Apply plan features
    if subscription and subscription.plan:
        for pf in subscription.plan.plan_features:
            if pf.feature.is_active:
                entitlements[pf.feature.key] = {
                    "enabled": pf.enabled,
                    "configuration": pf.configuration or {}
                }
                
    # 2. Get active tenant overrides
    override_stmt = select(models_entitlements.TenantOverride).options(
        selectinload(models_entitlements.TenantOverride.feature)
    ).filter(
        models_entitlements.TenantOverride.tenant_id == tenant_id
    )
    override_result = await db.execute(override_stmt)
    overrides = override_result.scalars().all()
    
    from datetime import datetime
    now = datetime.utcnow()
    
    # Apply overrides
    for override in overrides:
        if override.feature.is_active:
            # Check expiry
            if override.expires_at and override.expires_at < now:
                continue # Expired
                
            entitlements[override.feature.key] = {
                "enabled": override.enabled,
                "configuration": override.configuration or {}
            }
            
    return entitlements

def EntitlementChecker(feature_key: str):
    """
    FastAPI Dependency to strictly enforce feature entitlements at the endpoint level.
    """
    async def entitlement_checker(
        current_tenant: models.Tenant = Depends(get_current_tenant),
        current_user: models.User = Depends(get_current_user),
        db: AsyncSession = Depends(get_db)
    ):
        entitlements = await get_effective_entitlements(db, current_tenant.id)
        
        feature = entitlements.get(feature_key)
        if not feature or not feature.get("enabled"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Tenant is not entitled to feature: {feature_key}"
            )
            
        return current_user
        
    return entitlement_checker
