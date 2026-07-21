import pytest
from httpx import AsyncClient
from sqlalchemy.future import select

pytestmark = pytest.mark.asyncio

async def test_file_upload_validation(auth_client: AsyncClient, test_db):
    import models_drive
    
    # Simulate a valid PDF upload
    files = {"file": ("test.pdf", b"%PDF-1.4 mock content", "application/pdf")}
    response = await auth_client.post("/drive/upload", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    
    # Query database to confirm quota increment
    stmt = select(models_drive.PersonalDrive)
    result = await test_db.execute(stmt)
    drive = result.scalars().first()
    
    assert drive is not None
    assert drive.used_storage_bytes > 0
    assert drive.used_storage_bytes == len(b"%PDF-1.4 mock content")

async def test_quota_rejection(auth_client: AsyncClient):
    # Simulate massive payload exceeding 50MB
    # We'll use 51MB of '0' bytes to reliably trigger the 413 Payload Too Large
    large_content = b"0" * (51 * 1024 * 1024)
    files = {"file": ("massive.pdf", large_content, "application/pdf")}
    
    response = await auth_client.post("/drive/upload", files=files)
    
    # Safely rejected with 413
    assert response.status_code == 413
