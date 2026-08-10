import pytest
import models
import models_identity

@pytest.mark.asyncio
async def test_user_identity_creation(client, test_db):
    tenant = models.Tenant(name="T1", slug="t1", domain="t1.com")
    test_db.add(tenant)
    await test_db.commit()
    
    user = models.User(username="u1", email="u1@t1.com", password_hash="hash", tenant_id=tenant.id)
    test_db.add(user)
    await test_db.commit()
    
    # Create Google Identity
    identity_google = models_identity.UserIdentity(
        user_id=user.id,
        provider="google",
        provider_subject="google-123",
        email="u1@gmail.com"
    )
    test_db.add(identity_google)
    await test_db.commit()
    
    # Verify relationships
    assert len(user.identities) == 1
    assert user.identities[0].provider == "google"
