# ClgERP Project Overview

Based on a thorough review of the provided files and codebase, here is a comprehensive report on the **ClgERP** system.

## 1. High-Level Architecture
ClgERP is a full-stack, containerized College Enterprise Resource Planning (ERP) application. The infrastructure is orchestrated using Docker Compose and consists of the following services:
- **Backend**: A Python-based REST API server.
- **Celery Worker**: An asynchronous task queue worker for background processing.
- **Frontend**: A Next.js web application.
- **Database**: PostgreSQL 15 for relational data storage.
- **Cache**: Redis 7 for caching, rate limiting, and OTP management.
- **Reverse Proxy**: Nginx serving as an API gateway and static file server.

## 2. Backend Stack & Implementation
The backend is located in the `backend/` directory and is built with **FastAPI**.
- **Database ORM**: Uses **SQLAlchemy** with `asyncpg` for asynchronous PostgreSQL connections.
- **Authentication**: JWT (JSON Web Tokens) based authentication with Role-Based Access Control (RBAC). It includes a 2-Factor Authentication (2FA) flow utilizing Redis to store temporary OTPs.
- **Task Management**: Uses **Celery** to handle long-running or background tasks (e.g., sending emails, SMS).
- **Security**: Implements rate limiting using `slowapi`.
- **Modular Structure**: The API is heavily modularized, mirroring the ERP modules. Routers and database models are separated into domains like `admissions`, `finance`, `academics`, `lms`, `exams`, `placements`, `infrastructure`, `drive`, etc.

## 3. Frontend Stack & Implementation
The frontend is located in the `frontend/` directory and is built using **Next.js** and **React 19**.
- **Language**: TypeScript (`tsconfig.json`, `next-env.d.ts`).
- **UI/UX Capabilities**: Uses `@dnd-kit` for drag-and-drop interfaces, `react-dropzone` for file uploads, and `react-icons`.
- **Special Features**: Integrates `html5-qrcode` and `qrcode.react`, which aligns with the QR Code Verification, Gate Pass, and Asset Management features mentioned in the ERP documentation.
- **Testing**: End-to-End (E2E) testing is set up using **Cypress**.
- **Linting**: Configured with ESLint 9 for code quality.

## 4. Product Scope & Features (from ERP-doc.pdf)
The system is designed to be an end-to-end management solution for educational institutions. The functional scope includes:

### Campus Administration
- **Master Data & Admissions**: Institution structure, CRM integration, form configuration, document verification, and ID generation.
- **Student Finance**: Academic fee setup, online/offline payments (multiple payment gateway integrations), scholarships, refunds, and reminders.
- **HR & Member Records**: 360-degree profiles for students/faculty/staff, biometric attendance, and leave management.
- **Placements & Drive**: Placement cycles, company master data, application tracking, and customized document storage (Drive).

### Auxiliary Services
- **Hostel & Canteen**: Room allotment, fee setup, QR/Meal code operations, and internet/maintenance requests.
- **Transportation & Asset**: Route mapping, fee setup, non-movable asset mapping, and venue booking.

### Digital Learning & Academics
- **Academics**: Outcome-Based Education (OBE), Choice-Based Credit System (CBCS), term management, and automated timetables.
- **Learning Management System (LMS)**: Lesson plans, e-content distribution, assignments (Turnitin integration), discussion forums, and comprehensive e-assessments (MCQ, SCQ, subjective, graded).
- **Examinations**: Exam conduction, hall tickets, seating arrangements, evaluation management, and e-transcript generation.

### Campus Experience
- **Workflows & Gate Pass**: Digital approvals, grievance management, and QR/Biometric-enabled day/night outpasses.
- **Social & Events**: A Facebook-like campus feed, clubs/chapters management, E-notices, event ticketing, and mentor-mentee interactions.
- **Parent Portal**: Parent login for tracking fees, attendance, leave, and grades.

## 5. Third-Party Integrations
The system is designed to interface with various external services:
- **Payment Gateways**: CCAvenue, PayU, Paytm, Razorpay, etc.
- **Communication & SSO**: SMS/Email APIs, Google/Microsoft SSO.
- **Video Conferencing**: Zoom, Google Meet, MS Teams.
- **Specialized Software**: Koha (Library), Turnitin (Plagiarism), Tally/Zoho (Accounting).

## Summary
You are building (or maintaining) a massive, highly scalable educational platform. The backend is robustly designed to handle concurrent load via FastAPI and Celery, while the Next.js frontend is structured for a modern, responsive user experience. The database schema and API endpoints are logically segmented to support the extensive feature set outlined in the business requirements document.
