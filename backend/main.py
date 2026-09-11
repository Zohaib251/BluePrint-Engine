"""
Blueprint Engine API Application.

FastAPI backend service serving core API endpoints, database startup hooks, and health checks.
Requires Python 3.10+ and virtual environment execution.
"""

import os
from contextlib import asynccontextmanager
from typing import Dict, AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from init_db import init_db

# Load environment variables from .env file
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan context manager for startup and shutdown events.

    Runs database initialization and default admin seeding on application boot.
    """
    # Execute database table creation and admin seeder on startup
    await init_db()
    yield


# Initialize FastAPI Application instance with lifespan hook
app = FastAPI(
    title="Blueprint Engine API",
    description="Backend API Service for Blueprint Engine Monorepo",
    version="0.1.0",
    lifespan=lifespan,
)

# Parse allowed CORS origins from environment configuration
raw_cors = os.getenv("CORS_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in raw_cors.split(",")]

# Attach Cross-Origin Resource Sharing (CORS) Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health Check"])
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint for monitoring service status.

    Returns:
        Dict[str, str]: Service status payload.
    """
    return {
        "status": "operational",
        "service": "Blueprint Engine Backend",
        "environment": os.getenv("ENVIRONMENT", "development"),
    }
