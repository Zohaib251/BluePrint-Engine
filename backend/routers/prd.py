"""
PRD History CRUD and AI Generation router.

Provides endpoints for generating PRDs via Gemini 1.5 Flash, reading, listing, and deleting PRD records.
Protected strictly by JWT user authentication context.
"""

from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import User, PRDHistory
from schemas import PRDCreate, PRDResponse, ProjectBriefRequest
from auth import get_current_user
from ai_service import generate_prd_from_brief

router = APIRouter(prefix="/api/prd", tags=["PRD Management"])


@router.post("/generate", response_model=PRDResponse, status_code=status.HTTP_201_CREATED)
async def generate_and_save_prd(
    brief_data: ProjectBriefRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PRDHistory:
    """
    Generate a new PRD using Gemini 1.5 Flash AI and persist the structured JSON to PRDHistory.

    Increments the authenticated user's generation count upon successful generation.
    """
    try:
        # Invoke Gemini AI Service to generate structured PRD schema
        structured_prd = await generate_prd_from_brief(
            brief=brief_data.brief, title=brief_data.title
        )
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(err),
        )

    # Dump validated Pydantic model to JSON string for database storage
    prd_json_content = structured_prd.model_dump_json()

    # Create new PRDHistory database entity
    new_prd_history = PRDHistory(
        user_id=current_user.id,
        title=brief_data.title,
        content=prd_json_content,
    )
    db.add(new_prd_history)

    # Increment user generation counter
    current_user.generation_count += 1

    await db.commit()
    await db.refresh(new_prd_history)

    return new_prd_history


@router.post("", response_model=PRDResponse, status_code=status.HTTP_201_CREATED)
async def create_prd_history(
    prd_data: PRDCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PRDHistory:
    """
    Create a new manual PRD history record associated with current authenticated user.
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
