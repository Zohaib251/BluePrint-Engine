"""
Authentication dependencies module.

Provides FastAPI dependencies for extracting and verifying authenticated user context from JWT tokens.
"""

from uuid import UUID
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import jwt

from database import get_db
from models import User
from security import decode_access_token
from schemas import TokenData

# OAuth2 scheme extracting Bearer token from authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin")


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
) -> User:
    """
    Extract and validate authenticated User entity from bearer JWT.

    Args:
        token (str): Bearer token from Request Authorization header.
        db (AsyncSession): Database session instance.

    Returns:
        User: Authenticated database user object.

    Raises:
        HTTPException: 401 Unauthorized if token is missing, expired, or invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
        username: Optional[str] = payload.get("sub")
        user_id_str: Optional[str] = payload.get("user_id")

        if username is None or user_id_str is None:
            raise credentials_exception

        token_data = TokenData(username=username, user_id=user_id_str)
    except (jwt.PyJWTError, ValueError):
        raise credentials_exception

    try:
        user_id = UUID(token_data.user_id)
    except ValueError:
        raise credentials_exception

    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    return user
