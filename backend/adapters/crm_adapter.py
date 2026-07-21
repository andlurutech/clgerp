import asyncio
import httpx
import logging

logger = logging.getLogger(__name__)

class BaseCRMAdapter:
    async def sync_lead(self, payload: dict):
        raise NotImplementedError

class LeadSquaredAdapter(BaseCRMAdapter):
    async def sync_lead(self, payload: dict):
        # Simulate async HTTP call with timeout
        async with httpx.AsyncClient() as client:
            try:
                # response = await client.post("https://api.leadsquared.com/v2/LeadManagement.svc/Lead.Capture", json=payload, timeout=5.0)
                await asyncio.sleep(0.5) # Simulated network delay
                logger.info("Successfully synced lead to LeadSquared.")
            except httpx.TimeoutException:
                logger.error("LeadSquared API timeout.")

class ExtraaEdgeAdapter(BaseCRMAdapter):
    async def sync_lead(self, payload: dict):
        async with httpx.AsyncClient() as client:
            try:
                await asyncio.sleep(0.5)
                logger.info("Successfully synced lead to ExtraaEdge.")
            except httpx.TimeoutException:
                logger.error("ExtraaEdge API timeout.")
