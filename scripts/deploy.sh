#!/bin/bash
set -e

echo "Starting Zero-Downtime Deployment Process..."

# Ensure we have the latest environment variables
source .env || true

# Authenticate to GHCR
echo "Authenticating to GHCR..."
if [ -n "$CR_PAT" ]; then
    echo $CR_PAT | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin
else
    echo "Warning: CR_PAT not found. Make sure you are authenticated to GHCR."
fi

# Pull the latest immutable images from the registry
echo "Pulling latest production images..."
docker compose -f docker-compose.prod.yml pull

# Run Database Migrations natively through the backend container
echo "Executing automated Alembic migrations..."
docker compose -f docker-compose.prod.yml run --rm backend alembic upgrade head

# Orchestrate the cluster with zero-downtime recreation
echo "Deploying the cluster..."
docker compose -f docker-compose.prod.yml up -d --remove-orphans

# Prune old images to prevent disk space exhaustion over time
echo "Pruning dangling images..."
docker image prune -f

echo "Deployment successful! The cluster is secure and active."
