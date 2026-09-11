"""
PRD History CRUD and AI Generation router.

Provides endpoints for generating PRDs via Gemini 1.5 Flash, reading, listing, and deleting PRD records.
Enforces monthly generation quotas for standard users (5/month) while explicitly bypassing quotas for admins.
"""

from uuid import UUID
from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import User, PRDHistory
from schemas import PRDCreate, PRDResponse, ProjectBriefRequest
from auth import get_current_user
from ai_service import generate_prd_from_brief, GeminiRateLimitException

router = APIRouter(prefix="/api/prd", tags=["PRD Management"])

# Monthly generation quota limit for standard user accounts
STANDARD_USER_MONTHLY_QUOTA = 5


@router.post("/generate", response_model=PRDResponse, status_code=status.HTTP_201_CREATED)
async def generate_and_save_prd(
    brief_data: ProjectBriefRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PRDHistory:
    """
    Generate a new PRD using Gemini 1.5 Flash AI and persist the structured JSON to PRDHistory.

    Quota Enforcement:
    - Standard users (role != 'admin') are capped at 5 generations per calendar month.
    - Admin users (role == 'admin') explicitly BYPASS quota limits (infinite quota).
    """
    # CRITICAL: Check monthly quota for standard users (Bypassed if role == 'admin')
    if current_user.role != "admin":
        now = datetime.now(timezone.utc)
        start_of_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)

        # Query total generations performed by current user in the current calendar month
        count_stmt = select(func.count(PRDHistory.id)).where(
            PRDHistory.user_id == current_user.id,
            PRDHistory.created_at >= start_of_month,
        )
        count_result = await db.execute(count_stmt)
        monthly_generations = count_result.scalar() or 0

        if monthly_generations >= STANDARD_USER_MONTHLY_QUOTA:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    f"Monthly generation quota exceeded. Free tier limit is {STANDARD_USER_MONTHLY_QUOTA} "
                    "generations per month. Admin accounts enjoy unlimited generations."
                ),
            )

    try:
        # Invoke Gemini AI Service to generate structured PRD schema
        structured_prd = await generate_prd_from_brief(
            brief=brief_data.brief, title=brief_data.title
        )
    except GeminiRateLimitException:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="AI generation is currently experiencing high demand. Please try again in 1 minute.",
        )
    except ValueError as err:
        err_msg = str(err).lower()
        if "429" in err_msg or "resourceexhausted" in err_msg or "quota" in err_msg or "rate limit" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="AI generation is currently experiencing high demand. Please try again in 1 minute.",
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(err),
        )

    # Serialize validated Pydantic model to JSON string for database storage
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
