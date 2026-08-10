import pytest
from datetime import timedelta
import auth
from jose import jwt

def test_password_hashing():
    password = "SuperSecretPassword123"
    hashed = auth.get_password_hash(password)
    assert hashed != password
    assert auth.verify_password(password, hashed)
    assert not auth.verify_password("WrongPassword", hashed)

def test_jwt_creation_and_validation():
    data = {"sub": "testuser"}
    token = auth.create_access_token(data, expires_delta=timedelta(minutes=15))
    
    payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
    assert payload["sub"] == "testuser"
    assert "exp" in payload

def test_expired_jwt():
    data = {"sub": "testuser"}
    # Token expired 5 minutes ago
    token = auth.create_access_token(data, expires_delta=timedelta(minutes=-5))
    
    with pytest.raises(jwt.ExpiredSignatureError):
        jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])

def test_otp_generation():
    otp = auth.generate_otp()
    assert len(otp) == 6
    assert otp.isdigit()
