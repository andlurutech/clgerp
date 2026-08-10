# Entitlement Architecture

The Entitlement Architecture provides dynamic feature resolution based on a Tenant's active subscription plan and specific overrides.

## The Resolution Algorithm
The central `get_effective_entitlements` service (in `backend/services/entitlements.py`) computes the final effective feature access for a tenant:

```text
Plan Features
      +
Tenant Overrides
      ↓
Effective Entitlements
```

### Definitions
1. **Feature**: The global registry of platform capabilities (e.g., `ai.assistant`, `core.erp`). Includes metadata and category grouping.
2. **SubscriptionPlan**: Represents a tier (e.g., "Foundation", "Professional", "Intelligent", "Enterprise").
3. **PlanFeature**: The mapping linking a Feature to a Plan. It can contain `configuration` JSON for tier-specific quotas (e.g., `{"max_users": 5000}`).
4. **TenantOverride**: A tenant-specific modification to feature access (e.g., a 14-day trial for an add-on). Overrides take precedence over base PlanFeatures and can be used to enable *or* disable features.

## Backend Enforcement
All backend routes enforcing feature locks must use the `EntitlementChecker` dependency:
```python
@app.get("/api/ai/schedule", dependencies=[Depends(EntitlementChecker("ai.scheduling"))])
```
This guarantees that UI-level feature hiding cannot be bypassed by direct API calls.
