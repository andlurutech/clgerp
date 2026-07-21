import pytest
import pytest_asyncio
import os
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from main import app
from database import get_db
import auth

import models
import models_admissions
import models_finance
import models_academics
import models_lms
import models_exams
import models_hr_assets
import models_placements
import models_infrastructure
import models_drive

TEST_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://clgerp_user:clgerp_password@localhost:5432/clgerp_db")

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=test_engine, class_=AsyncSession
)

async def init_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.drop_all)
        await conn.run_sync(models_admissions.Base.metadata.drop_all)
        await conn.run_sync(models_finance.Base.metadata.drop_all)
        await conn.run_sync(models_academics.Base.metadata.drop_all)
        await conn.run_sync(models_lms.Base.metadata.drop_all)
        await conn.run_sync(models_exams.Base.metadata.drop_all)
        await conn.run_sync(models_hr_assets.Base.metadata.drop_all)
        await conn.run_sync(models_placements.Base.metadata.drop_all)
        await conn.run_sync(models_infrastructure.Base.metadata.drop_all)
        await conn.run_sync(models_drive.Base.metadata.drop_all)
        
        await conn.run_sync(models.Base.metadata.create_all)
        await conn.run_sync(models_admissions.Base.metadata.create_all)
        await conn.run_sync(models_finance.Base.metadata.create_all)
        await conn.run_sync(models_academics.Base.metadata.create_all)
        await conn.run_sync(models_lms.Base.metadata.create_all)
        await conn.run_sync(models_exams.Base.metadata.create_all)
        await conn.run_sync(models_hr_assets.Base.metadata.create_all)
        await conn.run_sync(models_placements.Base.metadata.create_all)
        await conn.run_sync(models_infrastructure.Base.metadata.create_all)
        await conn.run_sync(models_drive.Base.metadata.create_all)

async def drop_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.drop_all)
        await conn.run_sync(models_admissions.Base.metadata.drop_all)
        await conn.run_sync(models_finance.Base.metadata.drop_all)
        await conn.run_sync(models_academics.Base.metadata.drop_all)
        await conn.run_sync(models_lms.Base.metadata.drop_all)
        await conn.run_sync(models_exams.Base.metadata.drop_all)
        await conn.run_sync(models_hr_assets.Base.metadata.drop_all)
        await conn.run_sync(models_placements.Base.metadata.drop_all)
        await conn.run_sync(models_infrastructure.Base.metadata.drop_all)
        await conn.run_sync(models_drive.Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def test_db():
    await init_db()
        
    async_session = TestingSessionLocal()
    try:
        yield async_session
    finally:
        await async_session.close()
        await drop_db()

@pytest_asyncio.fixture(scope="function")
async def client(test_db):
    async def override_get_db():
        yield test_db
        
    app.dependency_overrides[get_db] = override_get_db
    
    # Use ASGITransport to properly route to FastAPI
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
        
    app.dependency_overrides.clear()

@pytest_asyncio.fixture(scope="function")
async def auth_client(client, test_db):
    user = models.User(
        username="testauth",
        email="testauth@clgerp.com",
        password_hash=auth.get_password_hash("password123"),
        is_active=True
    )
    test_db.add(user)
    await test_db.commit()
    
    token = auth.create_access_token(data={"sub": user.username})
    client.headers.update({"Authorization": f"Bearer {token}"})
    
    yield client
