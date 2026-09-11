"""
Pydantic Data Schemas Module.

Provides request validation models and response serializers for Auth, PRD CRUD, Admin Analytics, and Gemini AI Structured Outputs.
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
    """Payload validation for initiating Gemini AI Blueprint generation."""

    title: str = Field(
        ..., min_length=3, max_length=255, description="Target application or feature title"
    )
    brief: str = Field(
        ..., min_length=10, description="Project specification, requirements, and functional brief"
    )
    price_range: Optional[str] = Field(
        default="Low / Bootstrap ($0 - $50/mo)",
        description="Target Price / Budget Range",
    )
    traffic_range: Optional[str] = Field(
        default="MVP / Growth (< 10,000 MAU)",
        description="Expected Traffic Range",
    )


class DatabaseTableColumn(BaseModel):
    """Schema defining a database column."""

    name: str = Field(..., description="Column name")
    type: str = Field(..., description="Data type (e.g. VARCHAR, UUID, INTEGER, TIMESTAMP, BOOLEAN)")
    constraints: str = Field(..., description="Column constraints (e.g. PRIMARY KEY, UNIQUE, NOT NULL, FOREIGN KEY)")


class DatabaseTableSchema(BaseModel):
    """Schema defining a database table."""

    table_name: str = Field(..., description="Database table name")
    description: str = Field(..., description="Table purpose description")
    columns: List[DatabaseTableColumn] = Field(..., description="List of columns with types and constraints")


class APIRouteSchema(BaseModel):
    """Schema defining an API route."""

    method: str = Field(..., description="HTTP Method (GET, POST, PUT, DELETE)")
    path: str = Field(..., description="URL endpoint path")
    summary: str = Field(..., description="Summary of endpoint functionality")


# --- MODULE 1: PRODUCT REQUIREMENTS DOCUMENT (PRD) ---
class ScopeMatrixItem(BaseModel):
    feature: str = Field(..., description="Feature name")
    scope: str = Field(..., description="'In-Scope (Must Build for MVP)' or 'Out-of-Scope (Deferred to Phase 2)'")
    priority: str = Field(..., description="'P0 (Critical)' or 'P1 (High)'")
    details: str = Field(..., description="Concise scope rationale or boundary details")


class UserStoryItem(BaseModel):
    user_type: str = Field(..., description="Target user persona (e.g. Founder, Member, Customer, Admin)")
    action: str = Field(..., description="What the user wants to do")
    value: str = Field(..., description="The core benefit or value realized")
    acceptance_criteria: List[str] = Field(
        ..., description="Binary, testable acceptance criteria bullet points"
    )


class Module1PRD(BaseModel):
    executive_summary: str = Field(
        ..., description="Refined high-level product overview and value proposition"
    )
    scope_matrix: List[ScopeMatrixItem] = Field(
        ..., description="Scope matrix categorizing MVP vs Phase 2 features with P0/P1 tags"
    )
    user_stories: List[UserStoryItem] = Field(
        ..., description="Core user stories with binary acceptance criteria"
    )


# --- MODULE 2: TRAFFIC-DRIVEN INFRASTRUCTURE & SCALING SPECIFICATION ---
class Module2Infrastructure(BaseModel):
    hosting_architecture: str = Field(
        ..., description="Exact hosting infrastructure recommendation (e.g. Render/DigitalOcean VPS vs AWS ECS Cluster)"
    )
    hosting_rationale: str = Field(
        ..., description="The 'Why' explaining how this infrastructure accommodates the expected traffic range"
    )
    caching_cdn_strategy: str = Field(
        ..., description="Caching tier recommendations (e.g. Redis) and global edge delivery (e.g. Cloudflare)"
    )
    availability_and_safety: str = Field(
        ..., description="Availability SLAs, API latency targets (< 300ms), and database backup frequency"
    )


# --- MODULE 3: BUDGET-OPTIMIZED TECH STACK SELECTION ---
class CostEstimateItem(BaseModel):
    category: str = Field(..., description="Category: Hosting, Database, Auth & Security, Domain, Third-party APIs")
    service_or_tool: str = Field(..., description="Exact recommended technology or service (no code)")
    estimated_monthly_cost: str = Field(..., description="Estimated cost per month (e.g. '$0 - $15/mo')")


class Module3TechStack(BaseModel):
    frontend_technology: str = Field(..., description="Selected frontend framework (name only)")
    backend_technology: str = Field(..., description="Selected backend framework/runtime (name only)")
    database_technology: str = Field(..., description="Selected database engine/service (name only)")
    third_party_tools: str = Field(..., description="Key third-party tools for auth, cache, email (names only)")
    cost_table: List[CostEstimateItem] = Field(
        ..., description="Structured table estimating running costs within target budget"
    )
    total_monthly_estimate: str = Field(
        ..., description="Total monthly aggregate running cost within user budget"
    )


# --- MODULE 4: INFORMATION ARCHITECTURE & DATABASE BLUEPRINT ---
class SitemapRouteItem(BaseModel):
    page_name: str = Field(..., description="Page or screen title")
    route_path: str = Field(..., description="URL path (e.g. /dashboard or /settings)")
    access_level: str = Field(..., description="Public, Authenticated, or Admin")
    key_components: str = Field(..., description="Key panels and functional elements present")


class Module4DataArchitecture(BaseModel):
    sitemap_tree: List[SitemapRouteItem] = Field(
        ..., description="Nested map of all primary, secondary, and dashboard pages"
    )
    database_tables: List[DatabaseTableSchema] = Field(
        ..., description="Relational database tables with columns, types, and PK/FK boundaries"
    )
    api_routes: List[APIRouteSchema] = Field(
        ..., description="RESTful backend API routes powering the screens"
    )
    mermaid_diagram: str = Field(
        ..., description="Strictly valid Mermaid.js flowchart starting with 'graph TD'"
    )


# --- MODULE 5: STEP-BY-STEP DEVELOPER RUNBOOK ---
class MilestonePhase(BaseModel):
    phase_number: int = Field(..., description="Phase number (1, 2, 3, 4)")
    phase_name: str = Field(..., description="Phase title (e.g. Phase 1: Environment Setup & Database Base Creation)")
    execution_tasks: List[str] = Field(
        ..., description="Sequence of actionable, single-sentence instructions without guesswork"
    )


class Module5Runbook(BaseModel):
    milestones: List[MilestonePhase] = Field(
        ..., description="4 chronological execution phases from setup to launch"
    )


# --- MASTER BLUEPRINT CONTAINER SCHEMA ---
class GeminiBlueprintSchema(BaseModel):
    """
    Pydantic schema sent to Gemini AI API (strictly without default values).
    """

    title: str = Field(..., description="Master Blueprint Document Title")
    module_1_prd: Module1PRD = Field(
        ..., description="Module 1: Product Requirements Document"
    )
    module_2_infrastructure: Module2Infrastructure = Field(
        ..., description="Module 2: Traffic-Driven Infrastructure & Scaling Specification"
    )
    module_3_tech_stack: Module3TechStack = Field(
        ..., description="Module 3: Budget-Optimized Tech Stack Selection"
    )
    module_4_data_architecture: Module4DataArchitecture = Field(
        ..., description="Module 4: Information Architecture & Database Blueprint"
    )
    module_5_runbook: Module5Runbook = Field(
        ..., description="Module 5: Step-by-Step Developer Runbook"
    )


class PRDResponseSchema(GeminiBlueprintSchema):
    """
    Pydantic v2 Structured Output Schema for Master Product & Technical Blueprint Generation.
    Includes backward-compatibility fields for legacy PRD consumers.
    """

    architecture_overview: Optional[str] = None
    database_tables: Optional[List[DatabaseTableSchema]] = None
    api_routes: Optional[List[APIRouteSchema]] = None
    mermaid_diagram: Optional[str] = None


class AdminAnalyticsResponse(BaseModel):
    """Platform analytics serializer for Admin Control Center."""

    total_users: int
    total_prds: int
    users: List[UserResponse]
