"""
Gemini AI Service Module.

Integrates Google Gemini 1.5 Flash model with strict Pydantic JSON schema enforcement.
"""

import os
import json
import logging
import asyncio
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from dotenv import load_dotenv
from tenacity import (
    retry,
    stop_after_attempt,
    wait_fixed,
    retry_if_exception,
)

try:
    from schemas import PRDResponseSchema
except ImportError:
    from backend.schemas import PRDResponseSchema

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


def _log_retry_attempt(retry_state):
    """Log retry attempts triggered by rate limit exceptions."""
    logger.warning(
        f"[Tenacity Retry] Gemini 429 Rate Limit encountered. "
        f"Retrying attempt {retry_state.attempt_number} of 3 in 10 seconds..."
    )


@retry(
    reraise=True,
    stop=stop_after_attempt(3),
    wait=wait_fixed(10),
    retry=retry_if_exception(is_rate_limit_error),
    before_sleep=_log_retry_attempt,
)
async def generate_prd_from_brief(brief: str, title: str) -> PRDResponseSchema:
    """
    Generate a structured PRD using Google Gemini flash models.

    Wrapped with Tenacity @retry decorator:
    - Retries up to 3 times on 429 Rate Limit / Quota Exceeded exceptions
    - Waits 10 seconds between retry attempts
    - Reraises GeminiRateLimitException if all 3 retries fail

    Args:
        brief (str): The functional project brief description.
        title (str): The project title.

    Returns:
        PRDResponseSchema: Validated Pydantic model containing architecture,
                           database tables, API routes, and Mermaid diagram.

    Raises:
        GeminiRateLimitException: If 429 rate limit persists after 3 retries.
        ValueError: If GEMINI_API_KEY is missing or model response is invalid.
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

    # Construct concise structured prompt to minimize token consumption and generation time
    prompt = f"""
You are a Senior Technical Architect. Generate a concise, production-ready Product Requirement Document (PRD) for:

Title: {title}
Brief: {brief}

Guidelines:
1. Provide a concise 'architecture_overview' (2-3 focused paragraphs).
2. Provide 'database_tables' with relational tables and clean column definitions.
3. Provide 'api_routes' with essential core endpoints.
4. Provide a clean 'mermaid_diagram' starting with `graph TD`.
Be precise, direct, and avoid redundant filler.
"""

    # Enforce application/json response MIME type, Pydantic schema structure, and generous token limits to avoid truncation
    generation_config = GenerationConfig(
        response_mime_type="application/json",
        response_schema=PRDResponseSchema,
        temperature=0.3,
        max_output_tokens=8192,
    )

    last_error = None
    for model_name in candidate_models:
        try:
            logger.info(f"Attempting PRD generation with model: {model_name}")
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
            raw_json_text = response.text.strip()

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
            return validated_prd
        except Exception as err:
            logger.warning(f"Model {model_name} failed: {err}")
            last_error = err

    logger.error(f"Failed to generate structured PRD via Gemini candidate models: {last_error}")
    
    # If the underlying error is a rate limit / quota error, raise GeminiRateLimitException for Tenacity retry
    if is_rate_limit_error(last_error):
        raise GeminiRateLimitException(str(last_error))

    raise ValueError(f"Gemini AI PRD Generation Error: {str(last_error)}")


