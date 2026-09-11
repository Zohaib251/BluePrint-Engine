"""
Blueprint Engine API Application.

FastAPI backend service serving core API endpoints, JWT authentication, rate-limiting,
PRD history CRUD, admin analytics, and background 30-day data pruning tasks.
Requires Python 3.10+ and virtual environment execution.
"""

import asyncio
from contextlib import asynccontextmanager
from typing import Dict, AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from config import CORS_ORIGINS, ENVIRONMENT
from init_db import init_db
from limiter import limiter
from pruning import start_pruning_background_loop
from routers.auth import router as auth_router
from routers.prd import router as prd_router
from routers.admin import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan context manager for startup and shutdown events.

    Runs database initialization, seeds default admin, and launches the
    background automated 30-day data pruning service task.
    """
    # Initialize DB schema and admin user
    await init_db()

    # Launch automated background pruning task (Runs every 24 hours)
    prune_task = asyncio.create_task(start_pruning_background_loop(interval_hours=24))

    yield

    # Cancel background pruning task on application shutdown
    prune_task.cancel()
    try:
        await prune_task
    except asyncio.CancelledError:
        pass


# Initialize FastAPI Application instance with lifespan hook
app = FastAPI(
    title="Blueprint Engine API",
    description="Backend API Service for Blueprint Engine Monorepo",
    version="0.1.0",
    lifespan=lifespan,
)

# Attach SlowAPI Rate Limiter state and error handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Attach Cross-Origin Resource Sharing (CORS) Middleware from centralized config
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Endpoint Routers
app.include_router(auth_router)
app.include_router(prd_router)
app.include_router(admin_router)


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
        "environment": ENVIRONMENT,
        "cors_origins": CORS_ORIGINS,
    }
