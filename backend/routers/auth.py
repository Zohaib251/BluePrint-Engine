"""
Authentication endpoints router.

Provides user registration (signup), authentication (signin), and profile endpoints with rate-limiting.
"""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import User
from schemas import UserCreate, UserLogin, UserResponse, TokenResponse
from security import hash_password, verify_password, create_access_token
from auth import get_current_user
from limiter import limiter

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def signup(
    request: Request,
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Register a new user account.

    Rate limited to 5 requests per minute per IP address.
    """
    # Check if username already exists
    stmt = select(User).where(User.username == user_data.username)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already registered",
        )

    # Hash plaintext password and save user
    hashed_pw = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        password_hash=hashed_pw,
        role="user",
        generation_count=0,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user


@router.post("/signin", response_model=TokenResponse)
@limiter.limit("5/minute")
async def signin(
    request: Request,
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Authenticate user and issue JWT access token.

    Rate limited to 5 requests per minute per IP address.
    """
    # Retrieve user by username
    stmt = select(User).where(User.username == credentials.username)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT token
    access_token = create_access_token(
        data={"sub": user.username, "user_id": str(user.id)}
    )

    return TokenResponse(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_authenticated_user_profile(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Retrieve profile details for currently authenticated user context.
    """
    return current_user
