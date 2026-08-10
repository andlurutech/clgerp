import pytest
from uuid import uuid4
from datetime import datetime
from pydantic import ValidationError
import schemas

def test_user_read_schema_valid():
    valid_data = {
        "id": uuid4(),
        "tenant_id": uuid4(),
        "role_id": uuid4(),
        "username": "johndoe",
        "email": "john.doe@example.com",
        "phone_number": "+1234567890",
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    user = schemas.UserRead(**valid_data)
    assert user.username == "johndoe"
    assert user.email == "john.doe@example.com"

def test_user_read_schema_invalid_email():
    invalid_data = {
        "id": uuid4(),
        "tenant_id": uuid4(),
        "username": "johndoe",
        "email": "not-an-email",
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    with pytest.raises(ValidationError) as exc_info:
        schemas.UserRead(**invalid_data)
    assert "value is not a valid email address" in str(exc_info.value)

def test_tenant_read_schema():
    tenant_id = uuid4()
    data = {
        "id": tenant_id,
        "name": "Global Tech",
        "slug": "global-tech",
        "enabled_modules": ["Admissions", "Finance"]
    }
    tenant = schemas.TenantRead(**data)
    assert tenant.slug == "global-tech"
    assert "Admissions" in tenant.enabled_modules

def test_login_request_schema():
    req = schemas.LoginRequest(username_or_email="test", password="123")
    assert req.username_or_email == "test"
    assert req.password == "123"
