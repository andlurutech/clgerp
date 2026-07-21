import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

async def test_valid_login(client: AsyncClient, test_db):
    import auth, models
    user = models.User(
        username="logintester",
        email="login@clgerp.com",
        password_hash=auth.get_password_hash("securepass"),
        is_active=True
    )
    test_db.add(user)
    await test_db.commit()

    response = await client.post(
        "/login", 
        json={"username_or_email": "logintester", "password": "securepass"},
        headers={"X-Forwarded-For": "192.168.1.1"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

async def test_rate_limit_trigger(client: AsyncClient):
    # Hit the endpoint 6 rapid times
    # 5/minute limit on /login
    for i in range(5):
        response = await client.post(
            "/login", 
            json={"username_or_email": "fake", "password": "fake"},
            headers={"X-Forwarded-For": "192.168.1.1"}
        )
        assert response.status_code == 401

    # 6th request should trip slowapi and return 429
    response = await client.post(
        "/login", 
        json={"username_or_email": "fake", "password": "fake"},
        headers={"X-Forwarded-For": "192.168.1.1"}
    )
    assert response.status_code == 429
