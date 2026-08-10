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
# Migrations will be handled by Alembic instead of create_all


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

import api_auth, api_platform

app.include_router(api_auth.router)
app.include_router(api_platform.router)

@app.get("/users/me", response_model=schemas.UserRead)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
