import re
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_router import call_openrouter_for_json  
from fastapi.responses import JSONResponse

router = APIRouter()

class SuggestImprovementRequest(BaseModel):
    resume_text: str
    job_description: str



@router.post("/suggest-improvements")
async def suggest_improvements(data: SuggestImprovementRequest):
    prompt = f"""
You are an AI Career Coach helping a candidate improve their resume to match a given job description.

Job Description:
{data.job_description}

Candidate Resume:
{data.resume_text}

Analyze the resume and provide structured suggestions in the following JSON format:

{{
  "matching_skills": [...],
  "missing_skills": [...],
  "tools_to_learn": [...],
  "resources_to_explore": [...],
  "strengths": [...],
  "weaknesses": [...],
  "fit_summary": {{
    "technical_fit": "...",
    "upside": "...",
    "recommendation": "...",
    "alternative_roles": [...]
  }}
}}

Strictly return only the JSON. No explanation, no markdown, no commentary.
"""

    try:
        content = await call_openrouter_for_json(prompt)

        # ✅ Extract JSON from markdown block if exists
        match = re.search(r"```json\s*(.*?)\s*```", content, re.DOTALL)
        json_str = match.group(1).strip() if match else content.strip()

        suggestions = json.loads(json_str)

        return {
            "status": True,
            "message": "Improvement suggestions generated.",
            "suggestions": suggestions
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse LLM JSON response.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenRouter error: {str(e)}")
