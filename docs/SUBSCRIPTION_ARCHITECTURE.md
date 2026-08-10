# Subscription Architecture

ClgERP uses a separated commercial architecture to manage SaaS tiers. This supports fluid upgrades, downgrades, and trial periods without coupling a Tenant intrinsically to a static feature set.

## `SubscriptionPlan` vs `Subscription`
- **SubscriptionPlan**: The product tier definition (e.g., "Intelligent", "Professional"). It defines the bundled features and global limits for that tier.
- **Subscription**: The active entitlement contract for a `Tenant`. It records the `status` (active/trial/expired), `starts_at`, `ends_at`, and the `plan_id`.

## Billing-Ready Design
While actual payment processing and invoice generation are deferred, the data model perfectly supports future CRM and billing integrations. A tenant's capabilities rely on finding an `"active"` status on their current `Subscription`. Downgrading or expiring a subscription will immediately revoke dependent feature access.
