"""
Security module for password hashing and authentication helpers.

Uses passlib with bcrypt scheme for password hashing and verification.
"""

from passlib.context import CryptContext

# Configure password context using bcrypt hashing algorithm
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
