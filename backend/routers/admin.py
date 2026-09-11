"""
Admin Management and Analytics Router.

Provides admin-only endpoints for platform metrics and manual 30-day data pruning execution.
Restricted strictly to users with role == 'admin'.
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import User, PRDHistory
from schemas import AdminAnalyticsResponse, UserResponse
from auth import get_current_user
from pruning import prune_expired_prd_histories

router = APIRouter(prefix="/api/admin", tags=["Admin Control Panel"])


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency verifying that the requesting user possesses admin privileges.

    Raises:
        HTTPException: 403 Forbidden if user.role != 'admin'.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted strictly to Admin users.",
        )
    return current_user


@router.get("/analytics", response_model=AdminAnalyticsResponse)
async def get_platform_analytics(
    admin_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> AdminAnalyticsResponse:
    """
    Retrieve platform analytics metrics including total users, total PRDs, and user list.
    """
    # Count total registered users
    total_users_stmt = select(func.count(User.id))
    users_count_res = await db.execute(total_users_stmt)
    total_users = users_count_res.scalar() or 0

    # Count total PRD history records
    total_prds_stmt = select(func.count(PRDHistory.id))
    prds_count_res = await db.execute(total_prds_stmt)
    total_prds = prds_count_res.scalar() or 0

    # Retrieve all registered users
    users_stmt = select(User).order_by(User.created_at.desc())
    users_res = await db.execute(users_stmt)
    users = list(users_res.scalars().all())

    return AdminAnalyticsResponse(
        total_users=total_users,
        total_prds=total_prds,
        users=[UserResponse.model_validate(u) for u in users],
    )


@router.post("/prune")
async def trigger_manual_data_pruning(
    admin_user: User = Depends(require_admin),
) -> Dict[str, Any]:
    """
    Manually trigger the 30-day data pruning task immediately, bypassing the background timer.
    Deletes expired PRDHistory records (>30 days old) owned by non-admin users.
    """
    deleted_count = await prune_expired_prd_histories()
    return {
        "message": "Manual 30-day data pruning completed successfully.",
        "deleted_count": deleted_count,
    }
