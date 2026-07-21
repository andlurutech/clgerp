import asyncio
import logging

logger = logging.getLogger(__name__)

class CommunicationGateway:
    async def dispatch_sms(self, phone: str, message: str):
        try:
            await asyncio.sleep(0.2)
            logger.info(f"SMS dispatched to {phone}: {message}")
        except Exception as e:
            logger.error(f"Failed to send SMS: {e}")

    async def dispatch_email(self, email: str, subject: str, body: str):
        try:
            await asyncio.sleep(0.5)
            logger.info(f"Email dispatched to {email}: {subject}")
        except Exception as e:
            logger.error(f"Failed to send Email: {e}")
            
    async def trigger_ivr(self, phone: str, flow_id: str):
        try:
            await asyncio.sleep(0.8)
            logger.info(f"IVR Call triggered for {phone} using flow {flow_id}")
        except Exception as e:
            logger.error(f"Failed to trigger IVR: {e}")
