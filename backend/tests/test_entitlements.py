import pytest
from httpx import AsyncClient
import models
import models_entitlements
from config import settings

@pytest.mark.asyncio
async def test_entitlement_checker_blocks_unauthorized(client, test_db):
    # Setup Tenant, User
    tenant = models.Tenant(name="T1", slug="t1", domain="t1.com", status="active")
    test_db.add(tenant)
    await test_db.commit()
    
    user = models.User(username="u1", email="u1@t1.com", password_hash="hash", tenant_id=tenant.id)
    test_db.add(user)
    await test_db.commit()
    
    # We are testing the capability API since it relies on get_effective_entitlements
    import auth
    token = auth.create_access_token(data={"sub": user.username})
    
    client.headers.update({
        "Authorization": f"Bearer {token}",
        "Host": "t1.com"
    })
    
    # Should get capabilities with empty features
    response = await client.get("/api/platform/capabilities")
    assert response.status_code == 200
    assert response.json()["features"] == {}

@pytest.mark.asyncio
async def test_entitlement_checker_allows_with_override(client, test_db):
    tenant = models.Tenant(name="T2", slug="t2", domain="t2.com", status="active")
    test_db.add(tenant)
    await test_db.commit()
    
    feature = models_entitlements.Feature(key="ai.assistant", name="AI Assistant", is_active=True)
    test_db.add(feature)
    await test_db.commit()
    
    # Add override
    override = models_entitlements.TenantOverride(tenant_id=tenant.id, feature_id=feature.id, enabled=True)
    test_db.add(override)
    await test_db.commit()

    user = models.User(username="u2", email="u2@t2.com", password_hash="hash", tenant_id=tenant.id)
    test_db.add(user)
    await test_db.commit()

    import auth
    token = auth.create_access_token(data={"sub": user.username})
    client.headers.update({"Authorization": f"Bearer {token}", "Host": "t2.com"})

    response = await client.get("/api/platform/capabilities")
    assert response.status_code == 200
    features = response.json()["features"]
    assert "ai.assistant" in features
    assert features["ai.assistant"]["enabled"] is True
