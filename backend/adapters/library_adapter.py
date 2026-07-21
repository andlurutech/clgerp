import asyncio
import logging

logger = logging.getLogger(__name__)

class LibraryAdapter:
    async def fetch_overdue_fines(self):
        try:
            # Simulate fetching from Koha ILS API
            await asyncio.sleep(1.0)
            logger.info("Successfully fetched overdue fines from Koha ILS.")
            # Added fine_id for idempotency
            return [
                {"student_id": "student_1", "fine_amount": 50, "fine_id": "koha_fine_101"},
                {"student_id": "student_2", "fine_amount": 100, "fine_id": "koha_fine_102"},
                {"student_id": "student_1", "fine_amount": 25, "fine_id": "koha_fine_103"}
            ]
        except Exception as e:
            logger.error(f"Failed to fetch fines from Koha: {e}")
            return []
