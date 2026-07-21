import uuid
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta

import models, schemas, auth
import api_admissions, api_finance, api_academics, api_lms, api_exams
import models_admissions, models_finance, models_academics, models_lms, models_exams
import models_hr_assets, models_placements, models_infrastructure, models_drive
import api_placements, api_infrastructure, api_drive, api_integrations, api_documents, api_websockets
from database import engine, get_db, redis_client
from core.security import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)
models_admissions.Base.metadata.create_all(bind=engine)
models_finance.Base.metadata.create_all(bind=engine)
models_academics.Base.metadata.create_all(bind=engine)
models_lms.Base.metadata.create_all(bind=engine)
models_exams.Base.metadata.create_all(bind=engine)
models_hr_assets.Base.metadata.create_all(bind=engine)
models_placements.Base.metadata.create_all(bind=engine)
models_infrastructure.Base.metadata.create_all(bind=engine)
models_drive.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ClgERP Backend", root_path="/api")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(api_admissions.router)
app.include_router(api_finance.router)
app.include_router(api_academics.router)
app.include_router(api_lms.router)
app.include_router(api_exams.router)
app.include_router(api_placements.router)
app.include_router(api_infrastructure.router)
app.include_router(api_drive.router)
app.include_router(api_integrations.router)
app.include_router(api_documents.router)
app.include_router(api_websockets.router)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "https://demo.clgerp.com"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login", response_model=schemas.Token)
@limiter.limit("5/minute")
def login(request: Request, req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = auth.get_user(db, req.username_or_email)
    if not user or not auth.verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    role_name = user.role.name if user.role else "Student"

    if role_name == "Student":
        access_token = auth.create_access_token(data={"sub": user.username})
        refresh_token = auth.create_refresh_token(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}
    
    otp = auth.generate_otp()
    pre_auth_token = str(uuid.uuid4())
    
    redis_client.setex(f"otp:{pre_auth_token}", timedelta(minutes=auth.PRE_AUTH_EXPIRE_MINUTES), otp)
    redis_client.setex(f"preauth_user:{pre_auth_token}", timedelta(minutes=auth.PRE_AUTH_EXPIRE_MINUTES), user.username)

    if user.phone_number:
        auth.send_sms_otp(user.phone_number, otp)
    else:
        raise HTTPException(status_code=400, detail="User phone number missing for 2FA")
    
    return {
        "access_token": "", 
        "token_type": "bearer", 
        "pre_auth_token": pre_auth_token,
        "detail": "2FA_REQUIRED"
    }

@app.post("/verify-2fa", response_model=schemas.Token)
@limiter.limit("5/minute")
def verify_2fa(request: Request, req: schemas.TwoFARequest, db: Session = Depends(get_db)):
    stored_otp = redis_client.get(f"otp:{req.pre_auth_token}")
    username = redis_client.get(f"preauth_user:{req.pre_auth_token}")
    
    if not stored_otp or not username:
        raise HTTPException(status_code=400, detail="Invalid or expired pre-auth token")
        
    if stored_otp != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    user = auth.get_user(db, username)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
        
    redis_client.delete(f"otp:{req.pre_auth_token}")
    redis_client.delete(f"preauth_user:{req.pre_auth_token}")

    access_token = auth.create_access_token(data={"sub": user.username})
    refresh_token = auth.create_refresh_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

@app.get("/users/me", response_model=schemas.UserRead)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
