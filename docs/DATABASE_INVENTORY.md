# Database Inventory

| Model | Table | Tenant-owned? | Existing tenant_id? | Foreign keys | API usage |
| ----- | ----- | ------------- | ------------------- | ------------ | --------- |
| Tenant | tenants | Needs Analysis | No | None | (Requires API audit) |
| Role | roles | Needs Analysis | No | None | (Requires API audit) |
| User | users | Yes | Yes | tenant_id->tenants.id, role_id->roles.id | (Requires API audit) |
| ApplicationForm | application_forms | Needs Analysis | No | None | (Requires API audit) |
| StudentLedger | student_ledger | Needs Analysis | No | student_id->users.id | (Requires API audit) |
| Term | terms | Needs Analysis | No | program_id->programs.id | (Requires API audit) |
| CourseOffering | course_offerings | Needs Analysis | No | course_id->courses.id, term_id->terms.id | (Requires API audit) |
| ClassGroup | class_groups | Needs Analysis | No | course_offering_id->course_offerings.id, faculty_id->users.id | (Requires API audit) |
| CourseRegistration | course_registrations | Needs Analysis | No | student_id->users.id, course_offering_id->course_offerings.id | (Requires API audit) |
| Attendance | attendance | Needs Analysis | No | class_group_id->class_groups.id, student_id->users.id | (Requires API audit) |
| CourseContent | course_contents | Needs Analysis | No | class_group_id->class_groups.id | (Requires API audit) |
| Assignment | assignments | Needs Analysis | No | class_group_id->class_groups.id | (Requires API audit) |
| AssignmentSubmission | assignment_submissions | Needs Analysis | No | assignment_id->assignments.id, student_id->users.id | (Requires API audit) |
| QuestionBank | question_bank | Needs Analysis | No | course_id->courses.id, faculty_id->users.id | (Requires API audit) |
| Assessment | assessments | Needs Analysis | No | class_group_id->class_groups.id | (Requires API audit) |
| AssessmentSubmission | assessment_submissions | Needs Analysis | No | assessment_id->assessments.id, student_id->users.id | (Requires API audit) |
| GradingSchema | grading_schemas | Needs Analysis | No | program_id->programs.id | (Requires API audit) |
| UnifiedGradeBook | unified_grade_book | Needs Analysis | No | student_id->users.id, course_id->courses.id, term_id->terms.id | (Requires API audit) |
| GradeAuditLog | grade_audit_logs | Needs Analysis | No | grade_book_id->unified_grade_book.id, admin_id->users.id | (Requires API audit) |
| AnswerSheetMask | answer_sheet_masks | Needs Analysis | No | student_id->users.id, assessment_id->assessments.id | (Requires API audit) |
| HRProfile | hr_profiles | Yes | No | user_id->users.id | (Requires API audit) |
| LeaveRequest | leave_requests | Yes | No | user_id->users.id | (Requires API audit) |
| Asset | assets | Needs Analysis | No | None | (Requires API audit) |
| AssetAllocation | asset_allocations | Yes | No | asset_id->assets.id, user_id->users.id | (Requires API audit) |
| Organization | organizations | Needs Analysis | No | None | (Requires API audit) |
| PlacementOpportunity | placement_opportunities | Needs Analysis | No | organization_id->organizations.id | (Requires API audit) |
| PlacementApplication | placement_applications | Needs Analysis | No | opportunity_id->placement_opportunities.id, student_id->users.id | (Requires API audit) |
| IssuedCertificate | issued_certificates | Needs Analysis | No | student_id->users.id | (Requires API audit) |
| ResearchProject | research_projects | Needs Analysis | No | faculty_id->users.id | (Requires API audit) |
| HostelBlock | hostel_blocks | Needs Analysis | No | None | (Requires API audit) |
| HostelRoom | hostel_rooms | Needs Analysis | No | block_id->hostel_blocks.id | (Requires API audit) |
| HostelAllotment | hostel_allotments | Needs Analysis | No | student_id->users.id, room_id->hostel_rooms.id | (Requires API audit) |
| MaintenanceTicket | maintenance_tickets | Yes | No | user_id->users.id | (Requires API audit) |
| CanteenMenu | canteen_menus | Needs Analysis | No | None | (Requires API audit) |
| MealConsumption | meal_consumptions | Needs Analysis | No | student_id->users.id | (Requires API audit) |
| TransportRoute | transport_routes | Needs Analysis | No | None | (Requires API audit) |
| Post | community_posts | Needs Analysis | No | author_id->users.id | (Requires API audit) |
| Engagement | community_engagements | Yes | No | post_id->community_posts.id, user_id->users.id | (Requires API audit) |
| EventNotice | event_notices | Needs Analysis | No | None | (Requires API audit) |
| NoticeAcknowledgement | notice_acknowledgements | Yes | No | notice_id->event_notices.id, user_id->users.id | (Requires API audit) |
| GatePassRequest | gate_pass_requests | Needs Analysis | No | student_id->users.id | (Requires API audit) |
| BiometricLog | biometric_logs | Yes | No | user_id->users.id | (Requires API audit) |
| DriveFolder | drive_folders | Yes | No | user_id->users.id, parent_id->drive_folders.id | (Requires API audit) |
| DriveDocument | drive_documents | Yes | No | user_id->users.id, folder_id->drive_folders.id | (Requires API audit) |
| PersonalDrive | personal_drives | Yes | No | user_id->users.id | (Requires API audit) |
