# Identity Architecture

The Identity Architecture establishes an extensible, unified authentication and session model for the entire ClgERP Campus OS platform.

## Unified Identity (`User`)
The `User` model represents a human or service account within a `Tenant`. 
- **Roles and Permissions**: Determines what the identity can do via `role_id`.
- **Tenant Membership**: An identity is strictly scoped to a single `Tenant` (`tenant_id`).

## Multi-Provider Support (`UserIdentity`)
To support single sign-on (SSO) and multiple external providers (Google, Microsoft), the platform abstracts authentication credentials into a `UserIdentity` model.
- A `User` can have multiple `UserIdentity` records (e.g., one `local` password, one `google` SSO).
- The `provider` and `provider_subject` fields uniquely identify the user upstream.

## Session Management (`Session`)
Every successful authentication issues a `Session` record, tracking the device, login time, and expiration. This sets the foundation for:
- Viewing active sessions across devices.
- Revoking compromised sessions.
- Enforcing global sign-out policies.
