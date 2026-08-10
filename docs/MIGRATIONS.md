# Database Migrations

## Overview
ClgERP utilizes **Alembic** alongside SQLAlchemy 2.0 async engine to manage database migrations.

## Base Configuration
The `alembic.ini` and `env.py` files have been customized to:
1. Dynamically import all 45+ domain models seamlessly.
2. Read the PostgreSQL connection string via an environment-aware SQLAlchemy engine.

## Migration Baseline
Since the project was previously using `Base.metadata.create_all()` asynchronously without a tracked migration history, the first Alembic migration acts as the baseline:

```bash
alembic revision --autogenerate -m "baseline_multi_tenant"
```

> [!WARNING]
> Do **NOT** run Alembic autogenerate on an empty local SQLite instance for production migrations! The schemas utilize PostgreSQL-specific constraints and datatypes (such as native `UUID`). `autogenerate` must be executed against the Dockerized PostgreSQL instance.

## Existing Deployments
For deployments where a database *already* exists, executing the baseline migration will attempt to recreate existing tables. In those instances, you must "stamp" the database to indicate it is already at the baseline:

```bash
alembic stamp head
```
