# MFA Policy Architecture

ClgERP supports tenant-configurable Multi-Factor Authentication (MFA) policies to secure sensitive access across different institutions.

## Policies
A `Tenant` has an `mfa_requirement` property which dictates platform behavior:
- **`NONE`**: MFA is optional. Users can enable it voluntarily.
- **`STAFF_ONLY`**: Administrative and staff roles (e.g., Admin, Faculty, HR, Accountant, Librarian) are strictly required to use MFA. Students and external roles bypass this requirement unless manually opted in.
- **`ALL`**: Every user attempting to authenticate against the tenant must pass MFA.

## Authentication Flow (Anti-Replay)
1. **Credentials Validation**: Username/Password is verified.
2. **Policy Evaluation**: The backend calculates if MFA is required based on the tenant policy and user role.
3. **Pre-Auth Issuance**: If required, a short-lived (5-minute), single-use `pre_auth_token` is generated and temporarily stored in Redis with the `purpose="MFA_CHALLENGE"`.
4. **MFA Challenge**: The user submits their TOTP code via `/api/auth/mfa/verify` alongside the `pre_auth_token`.
5. **Token Exchange**: Upon successful validation against the encrypted TOTP secret, the `pre_auth_token` is instantly burned (preventing replay attacks), and the final `access_token` is issued.

## Enrollment Lifecycle
Users are forced to configure MFA before they can successfully authenticate. The lifecycle includes:
- `Setup`: Generates a base32 TOTP secret and a QR code provisioning URI. (MFA remains disabled).
- `Enable`: Verifies the first TOTP code from the authenticator app, officially enabling MFA and generating 8 fallback recovery codes.
