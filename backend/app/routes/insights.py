# app/routes/insights.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.utils.llm_openrouter import call_openrouter_model

router = APIRouter()

class SuggestImprovementRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None

@router.post("/suggest-improvements")
async def suggest_improvements(payload: SuggestImprovementRequest):
    resume_text = payload.resume_text.strip()
    job_description = payload.job_description.strip() if payload.job_description else None

    if not resume_text:
        raise HTTPException(status_code=400, detail="Resume text is required.")

    prompt = f"""
You are an expert career advisor and technical recruiter.

Analyze the following resume:
--- Resume Start ---
{resume_text}
--- Resume End ---

{"Also consider the following job description:\n" + job_description if job_description else ""}

Provide a JSON with:
1. "matching_skills"
2. "missing_skills"
3. "tools_to_learn"
4. "resources_to_explore"
5. "strengths"
6. "weaknesses"
7. "fit_summary"
"""

    try:
        raw_response = await call_openrouter_model(prompt)
        return {
            "status": True,
            "message": "Improvement suggestions generated.",
            "suggestions": raw_response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
