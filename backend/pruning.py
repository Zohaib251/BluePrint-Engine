"""
PRD History Automated Pruning Service Module.

Provides background cleanup of expired PRDHistory records older than 30 days.
CRITICAL: Explicitly preserves all PRDHistory records owned by Admin users (user.role == 'admin').
"""

import asyncio
import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy import delete, select
from database import AsyncSessionLocal
from models import PRDHistory, User

logger = logging.getLogger(__name__)


async def prune_expired_prd_histories() -> int:
    """
    Deletes PRDHistory records older than 30 days for standard users.

    CRITICAL SECURITY & RETENTION POLICY:
    PRDHistory records belonging to Admin users (user.role == 'admin') are EXPLICITLY EXCLUDED
    from deletion to guarantee permanent retention for admins.

    Returns:
        int: Number of deleted expired records.
    """
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=30)

    async with AsyncSessionLocal() as session:
        try:
            # Query subselect targeting non-admin user IDs only
            non_admin_users_query = select(User.id).where(User.role != "admin")

            # Construct delete query targeting records older than 30 days belonging ONLY to non-admins
            prune_stmt = (
                delete(PRDHistory)
                .where(PRDHistory.created_at < cutoff_date)
                .where(PRDHistory.user_id.in_(non_admin_users_query))
            )

            result = await session.execute(prune_stmt)
            deleted_count = result.rowcount
            await session.commit()

            if deleted_count > 0:
                logger.info(
                    f"[Background Pruning] Successfully removed {deleted_count} expired PRDHistory records (>30 days)."
                )
            return deleted_count
        except Exception as err:
            await session.rollback()
            logger.error(f"[Background Pruning] Error executing PRDHistory cleanup: {err}")
            return 0


async def start_pruning_background_loop(interval_hours: int = 24) -> None:
    """
    Infinite asyncio background loop running periodic database pruning.

    Args:
        interval_hours (int): Interval between cleanup executions in hours (default: 24h).
    """
    logger.info("[Background Pruning] Initializing PRD History automated 30-day retention loop...")
    while True:
        try:
            await prune_expired_prd_histories()
        except Exception as err:
            logger.error(f"[Background Pruning] Unexpected loop failure: {err}")

        # Sleep for specified interval (convert hours to seconds)
        await asyncio.sleep(interval_hours * 3600)
