import pytest
import pyotp
import models
import auth
from database import redis_client

@pytest.mark.asyncio
async def test_mfa_verify_flow_anti_replay(client, test_db):
    tenant = models.Tenant(name="T1", slug="t1", domain="t1.com", mfa_requirement="ALL")
    test_db.add(tenant)
    await test_db.commit()
    
    secret = pyotp.random_base32()
    user = models.User(
        username="u1", email="u1@t1.com", password_hash=auth.get_password_hash("pass"),
        tenant_id=tenant.id, mfa_enabled=True, mfa_secret=secret
    )
    test_db.add(user)
    await test_db.commit()
    
    # 1. Login to get pre_auth_token
    res = await client.post("/api/auth/login", json={"username_or_email": "u1", "password": "pass"}, headers={"Host": "t1.com"})
    pre_auth_token = res.json()["pre_auth_token"]
    
    # 2. Verify MFA
    totp = pyotp.TOTP(secret).now()
    res2 = await client.post("/api/auth/mfa/verify", json={"pre_auth_token": pre_auth_token, "otp": totp}, headers={"Host": "t1.com"})
    assert res2.status_code == 200
    assert "access_token" in res2.json()
    
    # 3. Try to replay the verification
    res3 = await client.post("/api/auth/mfa/verify", json={"pre_auth_token": pre_auth_token, "otp": totp}, headers={"Host": "t1.com"})
    assert res3.status_code == 400
    assert "Invalid, expired or already used" in res3.json()["detail"]

@pytest.mark.asyncio
async def test_pre_auth_token_cannot_access_apis(client, test_db):
    tenant = models.Tenant(name="T1", slug="t2", domain="t2.com", mfa_requirement="ALL")
    test_db.add(tenant)
    await test_db.commit()
    
    user = models.User(username="u2", email="u2@t2.com", password_hash=auth.get_password_hash("pass"), tenant_id=tenant.id)
    test_db.add(user)
    await test_db.commit()
    
    res = await client.post("/api/auth/login", json={"username_or_email": "u2", "password": "pass"}, headers={"Host": "t2.com"})
    pre_auth_token = res.json()["pre_auth_token"]
    
    # Try to access standard protected API using pre_auth_token
    res2 = await client.get("/api/users/me", headers={"Authorization": f"Bearer {pre_auth_token}", "Host": "t2.com"})
    assert res2.status_code == 401
