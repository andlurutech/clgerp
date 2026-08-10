import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from database import get_db
import auth
import models
import os

# NOTE: Since PostgreSQL is currently unavailable in the local environment,
# these tests are structured conceptually and might require modifications
# when executed against the real DB.

@pytest.mark.asyncio
async def test_tenant_isolation_deny_cross_tenant(client, test_db):
    """
    Tenant A user -> Tenant B resource -> DENY
    """
    # Create Tenant A
    tenant_a = models.Tenant(name="Tenant A", slug="tenant-a", domain="tenant-a.com", status="active")
    # Create Tenant B
    tenant_b = models.Tenant(name="Tenant B", slug="tenant-b", domain="tenant-b.com", status="active")
    test_db.add_all([tenant_a, tenant_b])
    await test_db.commit()

    # Create User for Tenant A
    user_a = models.User(username="usera", email="usera@tenant-a.com", password_hash="hash", tenant_id=tenant_a.id)
    test_db.add(user_a)
    await test_db.commit()

    # Create a Token for User A
    token = auth.create_access_token(data={"sub": user_a.username})

    # User A tries to access Tenant B by setting Host = tenant-b.com
    client.headers.update({
        "Authorization": f"Bearer {token}",
        "Host": "tenant-b.com"
    })

    # Since the request maps to Tenant B, but User A's token belongs to Tenant A,
    # the cross-tenant token replay protection in get_current_user MUST reject it.
    
    # We hit an authenticated endpoint (e.g., getting current user or dashboard)
    response = await client.get("/api/auth/me")
    
    # Expected: 403 Forbidden
    assert response.status_code == 403
    assert response.json()["detail"] == "Cross-tenant token replay denied"

@pytest.mark.asyncio
async def test_tenant_resolution_fallback(client, test_db):
    """
    Unknown hosts fail closed if not in development mode.
    """
    # Try accessing with unknown host
    client.headers.update({"Host": "unknown-host.com"})
    
    # Temporarily force production mode
    from config import settings
    orig_env = settings.app_env
    settings.app_env = "production"
    
    try:
        response = await client.get("/api/auth/me")
        # 404 or 400 for unknown tenant in prod
        assert response.status_code == 404
    finally:
        settings.app_env = orig_env
