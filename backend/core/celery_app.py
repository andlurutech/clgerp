import os
from celery import Celery

redis_base_url = os.getenv("REDIS_URL", "redis://localhost:6379")
# Strip trailing slash if present
redis_base_url = redis_base_url.rstrip('/')

# Configure Broker (Database 1) and Backend (Database 2) to prevent key collisions
celery_app = Celery(
    "clgerp_tasks",
    broker=f"{redis_base_url}/1",
    backend=f"{redis_base_url}/2",
    include=["tasks.communications"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
