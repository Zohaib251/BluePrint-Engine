"""
Blueprint Engine API Application.

FastAPI backend service serving core API endpoints and health checks.
Requires Python 3.10+ and virtual environment execution.
"""

import os
from typing import Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI Application instance
app = FastAPI(
    title="Blueprint Engine API",
    description="Backend API Service for Blueprint Engine Monorepo",
    version="0.1.0",
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
