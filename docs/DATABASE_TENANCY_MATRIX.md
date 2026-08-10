# Database Tenancy Matrix

| Model | Table | Classification | tenant_id required? | Ownership source | Reason |
| ----- | ----- | -------------- | ------------------- | ---------------- | ------ |
| Tenant | tenants | PLATFORM_GLOBAL | No | N/A | Root of the tenant architecture |
| Role | roles | TENANT_OWNED | Yes | Direct | Each tenant defines its own RBAC roles |
| User | users | TENANT_OWNED | Yes | Direct | Users belong to specific tenants |
| ApplicationForm | application_forms | TENANT_OWNED | Yes | Direct | Admissions applications are per-tenant |
| StudentLedger | student_ledger | TENANT_OWNED | Yes | Direct | Financial records must be strictly isolated |
| Term | terms | TENANT_OWNED | Yes | Direct | Academic calendars vary by tenant |
| CourseOffering | course_offerings | TENANT_OWNED | Yes | Direct | Specific to a tenant's term and course |
| ClassGroup | class_groups | TENANT_OWNED | Yes | Direct | Sections of a course offering |
| CourseRegistration | course_registrations | TENANT_OWNED | Yes | Direct | Student course enrollments |
| Attendance | attendance | TENANT_OWNED | Yes | Direct | Daily student attendance |
| CourseContent | course_contents | TENANT_OWNED | Yes | Direct | Tenant specific syllabus |
| Assignment | assignments | TENANT_OWNED | Yes | Direct | Assignments for a class group |
| AssignmentSubmission | assignment_submissions | TENANT_OWNED | Yes | Direct | Must match assignment's tenant |
| QuestionBank | question_bank | TENANT_OWNED | Yes | Direct | Tenant's pool of assessment questions |
| Assessment | assessments | TENANT_OWNED | Yes | Direct | Quiz/Test defined by tenant |
| AssessmentSubmission | assessment_submissions | TENANT_OWNED | Yes | Direct | Student assessment answers |
| GradingSchema | grading_schemas | TENANT_OWNED | Yes | Direct | Tenant-specific grading logic |
| UnifiedGradeBook | unified_grade_book | TENANT_OWNED | Yes | Direct | Final student grades |
| GradeAuditLog | grade_audit_logs | SYSTEM/AUDIT | Yes | Direct | Audit trails must be tenant-partitioned |
| AnswerSheetMask | answer_sheet_masks | TENANT_OWNED | Yes | Direct | Blind grading masks |
| HRProfile | hr_profiles | TENANT_OWNED | Yes | Direct | Employee HR records |
| LeaveRequest | leave_requests | TENANT_OWNED | Yes | Direct | Employee leave requests |
| Asset | assets | TENANT_OWNED | Yes | Direct | Tenant's physical/digital assets |
| AssetAllocation | asset_allocations | TENANT_OWNED | Yes | Direct | Assets given to users |
| Organization | organizations | PLATFORM_GLOBAL | No | N/A | Companies recruiting can span multiple tenants |
| PlacementOpportunity | placement_opportunities | TENANT_OWNED | Yes | Direct | Jobs posted to a specific tenant |
| PlacementApplication | placement_applications | TENANT_OWNED | Yes | Direct | Student applications to jobs |
| IssuedCertificate | issued_certificates | TENANT_OWNED | Yes | Direct | Certificates issued by the college |
| ResearchProject | research_projects | TENANT_OWNED | Yes | Direct | Academic research projects |
| HostelBlock | hostel_blocks | TENANT_OWNED | Yes | Direct | College infrastructure |
| HostelRoom | hostel_rooms | TENANT_OWNED | Yes | Direct | Rooms within a block |
| HostelAllotment | hostel_allotments | TENANT_OWNED | Yes | Direct | Student room assignments |
| MaintenanceTicket | maintenance_tickets | TENANT_OWNED | Yes | Direct | Infrastructure repairs |
| CanteenMenu | canteen_menus | TENANT_OWNED | Yes | Direct | Food menus |
| MealConsumption | meal_consumptions | TENANT_OWNED | Yes | Direct | Student meal tracking |
| TransportRoute | transport_routes | TENANT_OWNED | Yes | Direct | Bus routes |
| Post | community_posts | TENANT_OWNED | Yes | Direct | Internal college feed/notices |
| Engagement | community_engagements | TENANT_OWNED | Yes | Direct | Likes/comments on posts |
| EventNotice | event_notices | TENANT_OWNED | Yes | Direct | College announcements |
| NoticeAcknowledgement | notice_acknowledgements | TENANT_OWNED | Yes | Direct | Read receipts for notices |
| GatePassRequest | gate_pass_requests | TENANT_OWNED | Yes | Direct | Security gate passes |
| BiometricLog | biometric_logs | SYSTEM/AUDIT | Yes | Direct | Raw punch-in/out logs |
| DriveFolder | drive_folders | TENANT_OWNED | Yes | Direct | Personal drive directories |
| DriveDocument | drive_documents | TENANT_OWNED | Yes | Direct | Personal drive files |
| PersonalDrive | personal_drives | TENANT_OWNED | Yes | Direct | Personal drive quotas |
