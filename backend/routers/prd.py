"""
PRD History CRUD operations router.

Provides endpoints for creating, reading, listing, and deleting generated PRD history records.
Protected strictly by JWT user authentication context.
"""

from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import User, PRDHistory
from schemas import PRDCreate, PRDResponse
from auth import get_current_user

router = APIRouter(prefix="/api/prd", tags=["PRD History"])


@router.post("", response_model=PRDResponse, status_code=status.HTTP_201_CREATED)
async def create_prd_history(
    prd_data: PRDCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PRDHistory:
    """
    Create a new PRD history record associated with current authenticated user.
    Increments the user's generation count.
    """
    new_prd = PRDHistory(
        user_id=current_user.id,
        title=prd_data.title,
        content=prd_data.content,
    )
    db.add(new_prd)

    # Increment user generation counter
    current_user.generation_count += 1

    await db.commit()
    await db.refresh(new_prd)

    return new_prd


@router.get("", response_model=List[PRDResponse])
async def list_user_prd_histories(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[PRDHistory]:
    """
    Retrieve all PRD history records owned by current authenticated user.
    """
    stmt = (
        select(PRDHistory)
        .where(PRDHistory.user_id == current_user.id)
        .order_by(PRDHistory.created_at.desc())
    )
    result = await db.execute(stmt)
    prds = result.scalars().all()

    return list(prds)


@router.get("/{prd_id}", response_model=PRDResponse)
async def get_prd_history_by_id(
    prd_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PRDHistory:
    """
    Retrieve a specific PRD history record by unique identifier.
    Must belong to current authenticated user.
    """
    stmt = select(PRDHistory).where(
        PRDHistory.id == prd_id, PRDHistory.user_id == current_user.id
    )
    result = await db.execute(stmt)
    prd = result.scalar_one_or_none()

    if not prd:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PRD history record not found",
        )

    return prd


@router.delete("/{prd_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_prd_history_by_id(
    prd_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a specific PRD history record by unique identifier.
    Must belong to current authenticated user.
    """
    stmt = select(PRDHistory).where(
        PRDHistory.id == prd_id, PRDHistory.user_id == current_user.id
    )
    result = await db.execute(stmt)
    prd = result.scalar_one_or_none()

    if not prd:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PRD history record not found",
        )

    await db.delete(prd)
    await db.commit()
