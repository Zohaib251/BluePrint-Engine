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


async def generate_prd_from_brief(brief: str, title: str) -> PRDResponseSchema:
    """
    Generate a structured PRD using Google Gemini flash models.

    Enforces strictly valid JSON output matching PRDResponseSchema via
    response_mime_type="application/json".

    Args:
        brief (str): The functional project brief description.
        title (str): The project title.

    Returns:
        PRDResponseSchema: Validated Pydantic model containing architecture,
                           database tables, API routes, and Mermaid diagram.

    Raises:
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

    # Candidate models list in priority order (prefer models with higher free-tier quotas and fast response)
    configured_model = os.getenv("GEMINI_MODEL")
    candidate_models = [configured_model] if configured_model else []
    for m in ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest"]:
        if m not in candidate_models:
            candidate_models.append(m)

    # Construct structured prompt instructing AI on architecture, DB, routes, and Mermaid diagram
    prompt = f"""
You are a Senior Technical Architect. Generate a complete Product Requirement Document (PRD) for:

Title: {title}
Brief: {brief}

Requirements:
1. Provide a detailed 'architecture_overview' explaining core design decisions.
2. Provide a list of 'database_tables' with table names, descriptions, and column schemas (name, type, constraints).
3. Provide a list of 'api_routes' with HTTP methods, paths, and functional summaries.
4. Provide a 'mermaid_diagram' containing strictly valid Mermaid.js graph code (e.g. starting with `graph TD`).
"""

    # Enforce application/json response MIME type and Pydantic schema structure
    generation_config = GenerationConfig(
        response_mime_type="application/json",
        response_schema=PRDResponseSchema,
        temperature=0.7,
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
            raw_json_text = response.text

            # Validate JSON against Pydantic PRDResponseSchema model
            parsed_data = json.loads(raw_json_text)
            validated_prd = PRDResponseSchema.model_validate(parsed_data)
            return validated_prd
        except Exception as err:
            logger.warning(f"Model {model_name} failed: {err}")
            last_error = err

    logger.error(f"Failed to generate structured PRD via Gemini candidate models: {last_error}")
    error_msg = str(last_error)
    if "429" in error_msg or "ResourceExhausted" in error_msg or "quota" in error_msg.lower():
        raise ValueError(
            "Google Gemini API Rate Limit / Quota Exceeded (429). "
            "The free-tier quota was reached or requests were sent too quickly. "
            "Please wait about 30-60 seconds before trying again, or add a paid Gemini API key with billing enabled."
        )
    raise ValueError(f"Gemini AI PRD Generation Error: {error_msg}")


