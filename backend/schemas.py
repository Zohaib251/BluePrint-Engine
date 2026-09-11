"""
Pydantic Data Schemas Module.

Provides request validation models and response serializers for Auth, PRD CRUD, and Gemini AI Structured Outputs.
"""

from datetime import datetime
from uuid import UUID
from typing import Optional, List
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


class ProjectBriefRequest(BaseModel):
    """Payload validation for initiating Gemini AI PRD generation."""

    title: str = Field(
        ..., min_length=3, max_length=255, description="Target application or feature title"
    )
    brief: str = Field(
        ..., min_length=10, description="Project specification, requirements, and functional brief"
    )


class DatabaseTableColumn(BaseModel):
    """Schema defining a database column."""

    name: str = Field(..., description="Column name")
    type: str = Field(..., description="Data type (e.g. VARCHAR, UUID, INTEGER, TIMESTAMP)")
    constraints: str = Field(..., description="Column constraints (e.g. PRIMARY KEY, UNIQUE, NOT NULL)")


class DatabaseTableSchema(BaseModel):
    """Schema defining a database table."""

    table_name: str = Field(..., description="Database table name")
    description: str = Field(..., description="Table purpose description")
    columns: List[DatabaseTableColumn] = Field(..., description="List of columns")


class APIRouteSchema(BaseModel):
    """Schema defining an API route."""

    method: str = Field(..., description="HTTP Method (GET, POST, PUT, DELETE)")
    path: str = Field(..., description="URL endpoint path")
    summary: str = Field(..., description="Summary of endpoint functionality")


class PRDResponseSchema(BaseModel):
    """
    Pydantic v2 Structured Output Schema for Gemini PRD Generation.

    Enforces architecture overview, database schema, API routes, and valid Mermaid.js syntax.
    """

    title: str = Field(..., description="PRD Document Title")
    architecture_overview: str = Field(
        ..., description="Comprehensive system architecture overview and design explanations"
    )
    database_tables: List[DatabaseTableSchema] = Field(
        ..., description="List of relational database table schemas"
    )
    api_routes: List[APIRouteSchema] = Field(
        ..., description="List of RESTful backend API routes"
    )
    mermaid_diagram: str = Field(
        ..., description="Strictly valid Mermaid.js diagram string (e.g., graph TD or sequenceDiagram)"
    )
