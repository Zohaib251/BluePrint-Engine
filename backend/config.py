"""
Application Configuration Module.

Loads and centralizes environment configuration for database, security, and CORS policies.
Allows cross-origin requests from both local development and deployed frontend domains.
"""

import os
from typing import List
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv()

import secrets

# Deployment environment identifier
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

# Server binding port
PORT: int = int(os.getenv("PORT", "8000"))

# Cross-Origin Resource Sharing (CORS) Configuration
DEFAULT_ALLOWED_ORIGINS: str = (
    "http://localhost:3000,"
    "http://127.0.0.1:3000,"
    "https://blueprint-engine-frontend.onrender.com"
)
RAW_CORS: str = os.getenv("CORS_ORIGINS", DEFAULT_ALLOWED_ORIGINS)
CORS_ORIGINS: List[str] = [
    origin.strip() for origin in RAW_CORS.split(",") if origin.strip()
]

# Database Connection URI
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:password@localhost:5432/postgres",
)
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
if "sslmode=" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("sslmode=", "ssl=")

# JWT Authentication Security Configuration
JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
if not JWT_SECRET_KEY:
    if ENVIRONMENT.lower() == "production":
        # Generate cryptographically secure secret key if none provided in production
        JWT_SECRET_KEY = secrets.token_urlsafe(32)
    else:
        JWT_SECRET_KEY = "fallback_dev_secret_key_change_me_in_production_32b"

JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Google Gemini API Key
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
