"""
Gemini AI Service Module.

Integrates Google Gemini 1.5 Flash model with strict Pydantic JSON schema enforcement.
"""

import os
import json
import logging
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from dotenv import load_dotenv

try:
    from schemas import PRDResponseSchema
except ImportError:
    from backend.schemas import PRDResponseSchema

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Configure Google Generative AI SDK with API Key if available
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


async def generate_prd_from_brief(brief: str, title: str) -> PRDResponseSchema:
    """
    Generate a structured PRD using the gemini-1.5-flash model.

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

    # Ensure SDK is configured with active API key
    genai.configure(api_key=api_key)

    # Initialize Gemini 1.5 Flash Model instance
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")

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
        temperature=0.2,
    )

    try:
        response = model.generate_content(prompt, generation_config=generation_config)
        raw_json_text = response.text

        # Validate JSON against Pydantic PRDResponseSchema model
        parsed_data = json.loads(raw_json_text)
        validated_prd = PRDResponseSchema.model_validate(parsed_data)
        return validated_prd
    except Exception as err:
        logger.error(f"Failed to generate structured PRD via Gemini Flash: {err}")
        raise ValueError(f"Gemini AI PRD Generation Error: {str(err)}")
