# ClgERP Remediation Plan

This plan incorporates all mandatory amendments for establishing a secure, multi-tenant, white-label SaaS College ERP.

## Phase 1: Core Backend Restoration & Startup
- Repository analysis (Completed)
- Implement `backend/database.py` (Async SQLAlchemy, sessionmaker)
- Implement `backend/models.py` (Base, User, Role, Tenant)
- Implement `backend/schemas.py` (Pydantic models for Auth & Users)
- Implement `backend/auth.py` (JWT, OTP, Password Hashing)
- Ensure Application Startup

## Phase 2: Tenant Architecture & Data Isolation
- Standardize database models and foreign keys
- Introduce Alembic for migrations
- Implement Tenant Resolution (from Host header)
- Implement Tenant Context (`get_current_tenant`)
- Enforce Tenant Isolation globally

## Phase 3: Authentication & Authorization
- Robust JWT & Redis OTP 2FA flow
- Implement RBAC with granular permissions (`auth.PermissionChecker`)
- Security audit of existing endpoints

## Phase 4: Data Integrity & Finance
- Fix Database Deadlocks (Deterministic locking for registrations)
- Implement robust Waitlist lifecycle
- Audit Finance module (Payments, Refunds, Adjustments)
- Introduce Centralized Audit Logging

## Phase 5: Storage Architecture
- Refactor `api_drive.py` for chunked streaming uploads
- Abstract `StorageProvider` (LocalStorage & S3Storage)
- Enforce Tenant file isolation

## Phase 6: API Standardisation & White-Label Frontend
- Standardize API Error Handling (`{ success: false, error: {...} }`)
- Update Frontend API client (`fetchAPI`)
- Implement Tenant Branding (Logo, colors, domains)
- Enforce Module visibility flags

## Phase 7: Background Tasks & Integrations
- Audit Celery tasks (Idempotency, retries)
- Review Redis TTL usage
- Standardize CRM integrations (Adapters)

## Phase 8: Production Infrastructure
- Docker & Docker Compose hardening
- Nginx configuration (SSL Bootstrapping, Headers, Rate Limiting)
- Health checks, logging, and observability

## Phase 9: Final Testing & Validation
- Unit & Integration Tests (Security, Tenancy, Concurrency)
- Clean Deployment Test
- Generate `docs/FINAL_AUDIT_REPORT.md`
