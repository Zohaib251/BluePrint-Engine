"""
Pydantic Data Schemas Module.

Provides request validation models and response serializers for Auth and PRD endpoints.
"""

from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    """Payload validation for User Signup."""

    username: str = Field(
        ..., min_length=3, max_length=50, description="Unique username identifier"
    )
    password: str = Field(
        ..., min_length=6, max_length=100, description="Plain text account password"
    )


class UserLogin(BaseModel):
    """Payload validation for User Signin."""

    username: str = Field(..., description="User account username")
    password: str = Field(..., description="User account password")


class UserResponse(BaseModel):
    """Response serializer for User profile data."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    username: str
    role: str
    generation_count: int
    created_at: datetime


class TokenResponse(BaseModel):
    """JWT Access Token response structure."""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Parsed JWT payload metadata."""

    username: Optional[str] = None
    user_id: Optional[str] = None


class PRDCreate(BaseModel):
    """Payload validation for creating a PRD history record."""

    title: str = Field(
        ..., min_length=1, max_length=255, description="PRD document title"
    )
    content: str = Field(
        ..., min_length=1, description="Generated PRD document content"
    )


class PRDResponse(BaseModel):
    """Response serializer for PRD History records."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    title: str
    content: str
    created_at: datetime
