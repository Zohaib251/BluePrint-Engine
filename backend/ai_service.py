"""
Gemini AI Service Module.

Integrates Google Gemini 1.5 Flash model with strict Pydantic JSON schema enforcement.
"""

import os
import json
import logging
import asyncio
import google.generativeai as genai
import google.generativeai.types.content_types as ct
import google.generativeai.types.generation_types as gt
from google.ai.generativelanguage_v1beta.types import content as protos
from google.generativeai.types import GenerationConfig
from dotenv import load_dotenv
from tenacity import (
    retry,
    stop_after_attempt,
    wait_fixed,
    retry_if_exception,
)

try:
    from schemas import PRDResponseSchema, GeminiBlueprintSchema
except ImportError:
    from backend.schemas import PRDResponseSchema, GeminiBlueprintSchema


def _build_strict_proto_schema(schema_class):
    """
    Convert a Pydantic schema class to a protos.Schema ensuring all properties
    are explicitly marked as required so Gemini does not truncate output.
    """
    def fix_schema_required(schema_dict: dict):
        if "properties" in schema_dict and isinstance(schema_dict["properties"], dict):
            if not schema_dict.get("required"):
                schema_dict["required"] = list(schema_dict["properties"].keys())
            for prop in schema_dict["properties"].values():
                if isinstance(prop, dict):
                    fix_schema_required(prop)
        if "items" in schema_dict and isinstance(schema_dict["items"], dict):
            fix_schema_required(schema_dict["items"])

    raw_schema = ct._schema_for_class(schema_class)
    fix_schema_required(raw_schema)
    raw_schema = gt._rename_schema_fields(raw_schema)
    return protos.Schema(raw_schema)

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)
load_dotenv()

logger = logging.getLogger(__name__)

# Configure Google Generative AI SDK with API Key if available (using REST transport)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY, transport="rest")


class GeminiRateLimitException(Exception):
    """Raised when Gemini API encounters a 429 rate limit or quota exhaustion."""
    pass


class GeminiContentFilterException(Exception):
    """Raised when Gemini content or safety filters block output (e.g. Recitation)."""
    pass


def is_rate_limit_error(exception: BaseException) -> bool:
    """Predicate identifying Gemini rate limit (429) or quota exceeded exceptions."""
    if isinstance(exception, GeminiRateLimitException):
        return True
    err_str = str(exception).lower()
    return (
        "429" in err_str
        or "resourceexhausted" in err_str
        or "quota" in err_str
        or "rate limit" in err_str
    )


def is_retryable_ai_error(exception: BaseException) -> bool:
    """Predicate identifying Gemini retryable errors (429 or transient recitation)."""
    if isinstance(exception, (GeminiRateLimitException, GeminiContentFilterException)):
        return True
    err_str = str(exception).lower()
    return (
        is_rate_limit_error(exception)
        or "recitation" in err_str
        or "finish_reason is 4" in err_str
        or "copyrighted" in err_str
    )


def extract_response_text(response) -> str:
    """
    Safely extract generated text from Gemini API response.
    Inspects candidate finish_reason to gracefully detect recitation or safety filters.
    """
    if not getattr(response, "candidates", None):
        raise GeminiContentFilterException("Gemini returned no candidate responses.")

    candidate = response.candidates[0]
    finish_reason = getattr(candidate, "finish_reason", None)
    finish_name = str(finish_reason)

    if finish_reason == 4 or "RECITATION" in finish_name:
        raise GeminiContentFilterException(
            "Gemini recitation filter triggered (the generated text closely matched existing training documents). "
            "Re-synthesizing with higher entropy and original phrasing..."
        )
    if finish_reason == 3 or "SAFETY" in finish_name:
        raise GeminiContentFilterException("Gemini safety filter triggered.")

    # Extract text from candidate parts if present
    if hasattr(candidate, "content") and hasattr(candidate.content, "parts") and candidate.content.parts:
        parts_text = "".join(
            part.text for part in candidate.content.parts if hasattr(part, "text") and part.text
        )
        if parts_text:
            return parts_text.strip()

    try:
        return response.text.strip()
    except Exception as exc:
        raise GeminiContentFilterException(f"Unable to extract text from response: {exc}")


def _log_retry_attempt(retry_state):
    """Log retry attempts triggered by rate limit or filter exceptions."""
    logger.warning(
        f"[Tenacity Retry] Gemini retryable error encountered ({retry_state.outcome.exception()}). "
        f"Retrying attempt {retry_state.attempt_number} of 3 in 10 seconds..."
    )


@retry(
    reraise=True,
    stop=stop_after_attempt(3),
    wait=wait_fixed(10),
    retry=retry_if_exception(is_retryable_ai_error),
    before_sleep=_log_retry_attempt,
)
async def generate_prd_from_brief(
    brief: str,
    title: str,
    price_range: str = "Low / Bootstrap ($0 - $50/mo)",
    traffic_range: str = "MVP / Growth (< 10,000 MAU)",
) -> PRDResponseSchema:
    """
    Generate a Master Product & Technical Blueprint using Google Gemini flash models.

    Wrapped with Tenacity @retry decorator:
    - Retries up to 3 times on 429 Rate Limit / Quota Exceeded exceptions
    - Waits 10 seconds between retry attempts
    - Reraises GeminiRateLimitException if all 3 retries fail

    Args:
        brief (str): The functional project description and specifications.
        title (str): The project title.
        price_range (str): Target budget tier.
        traffic_range (str): Expected traffic scale.

    Returns:
        PRDResponseSchema: Validated 5-module master blueprint model.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is not configured in backend environment (.env). "
            "Please check cheezin.txt for setup instructions."
        )

    # Ensure SDK is configured with active API key and reliable REST transport
    genai.configure(api_key=api_key, transport="rest")

    # Candidate models list in priority order (strictly use lightest flash-lite models)
    configured_model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
    candidate_models = [configured_model] if configured_model else []
    for m in ["gemini-3.5-flash-lite", "gemini-3.5-flash"]:
        if m not in candidate_models:
            candidate_models.append(m)

    # Construct comprehensive 5-Module Master Blueprint Prompt
    prompt = f"""
You are an Elite AI Software Architect and Product Lead. Your task is to generate a comprehensive, code-free "Master Product & Technical Blueprint" based strictly on the user parameters provided below.

This document must act as a seamless bridge between a non-technical founder and a core developer. It must contain NO source code, but should provide absolute clarity on specifications, database logic, structural tiers, infrastructure scaling, and implementation paths.

### USER INPUTS:
- Project Name: {title}
- Project Description: {brief}
- Target Price/Budget Range: {price_range}
- Expected Traffic Range: {traffic_range}

Generate the full blueprint using the following five-part framework:

---

### MODULE 1: PRODUCT REQUIREMENTS DOCUMENT (PRD)
1.1 Executive Summary: Refine the user's description into a professional high-level product overview and value proposition.
1.2 Scope Matrix (MVP vs. Phase 2): Group features into a clear matrix categorizing what is "In-Scope (Must Build for MVP)" and "Out-of-Scope (Deferred to Phase 2)". Priority tiers should be labeled as P0 (Critical) and P1 (High).
1.3 Core User Stories & Acceptance Criteria: Provide a punchy list of user stories formatted as "As a [User Type], I want to [Action], so that [Value]". Each story must have a binary, testable "Acceptance Criteria" list.

### MODULE 2: TRAFFIC-DRIVEN INFRASTRUCTURE & SCALING SPECIFICATION
Based explicitly on the expected traffic range ({traffic_range}), map out the scaling parameters:
2.1 Hosting Architecture: Recommend the exact hosting infrastructure type (e.g., Simple Shared/VPS like DigitalOcean/Render vs. Enterprise Auto-scaling AWS/GCP clusters). Explaining the "Why" behind it.
2.2 Caching & CDN Strategy: Define whether the system requires active caching tiers (e.g., Redis, Memcached) or global edge delivery (e.g., Cloudflare) to optimize latency for this tier of traffic.
2.3 Availability & Data Safety: Outline specific guidelines for system performance targets (e.g., API latency < 300ms) and database backup frequencies required to support this target traffic without downtime.

### MODULE 3: BUDGET-OPTIMIZED TECH STACK SELECTION
Based explicitly on the target price/budget range ({price_range}), propose a highly tailored stack:
3.1 Technology Stack Selection: Detail the programming frameworks, databases, and third-party tools that balance maximum engineering velocity with minimum overhead cost (e.g., choosing BaaS options like Supabase/Firebase for low budgets vs. Custom Enterprise SQL/NoSQL architectures for high budgets). Do not write any code blocks, simply name the technologies.
3.2 Estimated Monthly Operational Costs: Provide a structured table estimating the absolute running costs (Hosting, Domain, Authentication APIs, Database, Third-party integrations) mapping perfectly within the user's financial limits. Include category, tool name, and cost.

### MODULE 4: INFORMATION ARCHITECTURE & DATABASE BLUEPRINT
4.1 System Sitemap Tree: Outline a visual, nested map of all primary, secondary, and dashboard pages or route layouts required for this application type.
4.2 Relational Data Entities (Schema Tables): For every core feature, list the required database tables. For each table, list the column names, the data types (e.g., Integer, String, Boolean, Timestamp, UUID), and explicit Primary/Foreign Key relational boundaries. Do not use SQL syntax.
4.3 Mermaid Architecture Diagram: Generate a strictly valid Mermaid flowchart starting with `graph TD` showing Client -> CDN/Gateway -> Backend Server -> Database & Cache / External Services.

### MODULE 5: STEP-BY-STEP DEVELOPER RUNBOOK
5.1 Chronological Milestones: Divide the complete build into 4 clear execution phases:
   - Phase 1: Environment Setup & Database Base Creation
   - Phase 2: User Core Infrastructure & Backend API Layout
   - Phase 3: Primary Functional Features Deployment
   - Phase 4: Integration, Hardening, Optimization & Launch Prep
5.2 Punchy Execution Tasks: Within each phase, provide a sequence of highly actionable, single-sentence instructions so a developer can execute down the line without guesswork.

IMPORTANT GUIDELINES:
- Output MUST strictly follow the JSON response schema.
- Avoid any source code blocks. Focus purely on technical definitions, architectural design, and clear execution steps.
- Use professional software engineering terminology and short, scannable sentences.
- Originality: Create original entity schemas tailored specifically to the project.
"""

    # Enforce application/json response MIME type with strict proto schema requiring all properties
    proto_schema = _build_strict_proto_schema(GeminiBlueprintSchema)
    generation_config = GenerationConfig(
        response_mime_type="application/json",
        response_schema=proto_schema,
        temperature=0.7,
        max_output_tokens=8192,
    )

    last_error = None
    for model_name in candidate_models:
        try:
            logger.info(f"Attempting Master Blueprint generation with model: {model_name}")
            model = genai.GenerativeModel(model_name=model_name)
            # Use asyncio.to_thread with REST transport for non-blocking and robust execution
            response = await asyncio.wait_for(
                asyncio.to_thread(
                    model.generate_content,
                    prompt,
                    generation_config=generation_config,
                ),
                timeout=60.0,
            )
            raw_json_text = extract_response_text(response)

            # Clean possible markdown fences if present
            if raw_json_text.startswith("```"):
                lines = raw_json_text.splitlines()
                if lines and lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_json_text = "\n".join(lines).strip()

            # Validate JSON against Pydantic PRDResponseSchema model
            parsed_data = json.loads(raw_json_text)
            validated_prd = PRDResponseSchema.model_validate(parsed_data)

            # Ensure backward compatibility aliases are populated
            if not validated_prd.architecture_overview and validated_prd.module_1_prd:
                validated_prd.architecture_overview = validated_prd.module_1_prd.executive_summary
            if not validated_prd.database_tables and validated_prd.module_4_data_architecture:
                validated_prd.database_tables = validated_prd.module_4_data_architecture.database_tables
            if not validated_prd.api_routes and validated_prd.module_4_data_architecture:
                validated_prd.api_routes = validated_prd.module_4_data_architecture.api_routes
            if not validated_prd.mermaid_diagram and validated_prd.module_4_data_architecture:
                validated_prd.mermaid_diagram = validated_prd.module_4_data_architecture.mermaid_diagram

            return validated_prd
        except Exception as err:
            logger.warning(f"Model {model_name} failed: {err}")
            last_error = err

    logger.error(f"Failed to generate structured PRD via Gemini candidate models: {last_error}")
    
    # If the underlying error is a rate limit / quota error, raise GeminiRateLimitException for Tenacity retry
    if is_rate_limit_error(last_error):
        raise GeminiRateLimitException(str(last_error))
    if isinstance(last_error, GeminiContentFilterException) or "recitation" in str(last_error).lower():
        raise GeminiContentFilterException(str(last_error))

    raise ValueError(f"Gemini AI PRD Generation Error: {str(last_error)}")


