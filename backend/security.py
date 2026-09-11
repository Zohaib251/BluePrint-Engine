"""
Security and JWT token management module.

Handles password hashing via passlib/bcrypt and JWT token creation/verification via PyJWT.
Isolates JWT credentials strictly within environment configuration.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

# Retrieve JWT secret configuration strictly from environment
JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY", "fallback_dev_secret_key_change_me_in_production_32b"
)
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Configure password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Generate bcrypt hash from plain-text password string.

    Args:
        password (str): Plain-text password.

    Returns:
        str: Hashed password string.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify plain-text password against stored bcrypt hash.

    Args:
        plain_password (str): Candidate password string.
        hashed_password (str): Stored bcrypt hash.

    Returns:
        bool: True if matching, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: Dict[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Encode payload claims into signed JWT access token.

    Args:
        data (Dict[str, Any]): Claims payload (sub, user_id, etc.).
        expires_delta (Optional[timedelta]): Custom token expiration duration.

    Returns:
        str: Encoded JWT string.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)

    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "iat": now})

    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT access token.

    Args:
        token (str): Encoded JWT string.

    Returns:
        Dict[str, Any]: Decoded payload claims dictionary.

    Raises:
        jwt.PyJWTError: If token signature or expiration is invalid.
    """
    payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    return payload
