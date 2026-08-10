# Multi-Tenancy Architecture

## Tenant Definition
The system operates on a Pooled (Tenant-per-Row) multi-tenancy model. All data resides in a single database schema, but nearly all business models possess a `tenant_id` foreign key referencing the `tenants` table.

## Tenant Resolution Workflow
1. Client connects via a specific domain or subdomain (e.g., `api.college1.com`).
2. Nginx forwards the traffic, preserving the `Host` header.
3. The `get_current_tenant` FastAPI dependency inspects the `Host` header, looks up `Tenant.domain`, and retrieves the tenant context.
4. If the tenant is inactive or unknown, the request fails closed immediately.

## Authorization and Membership
A valid JWT token only proves a user's identity, NOT their authorization to the active tenant.
The `get_current_user` dependency automatically asserts:
```python
if user.tenant_id != current_tenant.id:
    raise 403 Forbidden
```
This guarantees cross-tenant token replays are impossible.

## Scoping Queries
At the repository layer, all queries against tenant-owned data must be scoped to the active tenant:
```python
select(Model).filter(Model.tenant_id == current_tenant.id)
```
This serves as a secondary defense-in-depth against IDOR vulnerabilities, combined with the primary token replay protection.
