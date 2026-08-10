import pytest
from httpx import AsyncClient
import models
import auth

@pytest.mark.asyncio
async def test_mfa_policy_none(client, test_db):
    tenant = models.Tenant(name="T1", slug="t1", domain="t1.com", mfa_requirement="NONE")
    test_db.add(tenant)
    await test_db.commit()
    
    user = models.User(username="u1", email="u1@t1.com", password_hash=auth.get_password_hash("pass"), tenant_id=tenant.id)
    test_db.add(user)
    await test_db.commit()
    
    response = await client.post("/api/auth/login", json={"username_or_email": "u1", "password": "pass"}, headers={"Host": "t1.com"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "pre_auth_token" not in response.json()

@pytest.mark.asyncio
async def test_mfa_policy_all(client, test_db):
    tenant = models.Tenant(name="T2", slug="t2", domain="t2.com", mfa_requirement="ALL")
    test_db.add(tenant)
    await test_db.commit()
    
    user = models.User(username="u2", email="u2@t2.com", password_hash=auth.get_password_hash("pass"), tenant_id=tenant.id)
    test_db.add(user)
    await test_db.commit()
    
    response = await client.post("/api/auth/login", json={"username_or_email": "u2", "password": "pass"}, headers={"Host": "t2.com"})
    assert response.status_code == 200
    assert "pre_auth_token" in response.json()
    assert response.json()["detail"] == "MFA_REQUIRED"

@pytest.mark.asyncio
async def test_mfa_policy_staff_only(client, test_db):
    tenant = models.Tenant(name="T3", slug="t3", domain="t3.com", mfa_requirement="STAFF_ONLY")
    test_db.add(tenant)
    await test_db.commit()
    
    role_admin = models.Role(name="Admin", tenant_id=tenant.id)
    role_student = models.Role(name="Student", tenant_id=tenant.id)
    test_db.add_all([role_admin, role_student])
    await test_db.commit()
    
    u_admin = models.User(username="admin", email="a@t3.com", password_hash=auth.get_password_hash("pass"), tenant_id=tenant.id, role_id=role_admin.id)
    u_student = models.User(username="student", email="s@t3.com", password_hash=auth.get_password_hash("pass"), tenant_id=tenant.id, role_id=role_student.id)
    test_db.add_all([u_admin, u_student])
    await test_db.commit()
    
    # Admin gets challenged
    res1 = await client.post("/api/auth/login", json={"username_or_email": "admin", "password": "pass"}, headers={"Host": "t3.com"})
    assert "pre_auth_token" in res1.json()
    
    # Student gets through
    res2 = await client.post("/api/auth/login", json={"username_or_email": "student", "password": "pass"}, headers={"Host": "t3.com"})
    assert "access_token" in res2.json()
