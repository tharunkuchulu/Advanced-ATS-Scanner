from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.utils.llm_utils import suggest_resume_improvements

router = APIRouter()

class SuggestImprovementRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None

@router.post("/suggest-improvements")
async def suggest_improvements(payload: SuggestImprovementRequest):
    resume_text = payload.resume_text.strip()
    job_description = payload.job_description.strip() if payload.job_description else ""
    if not resume_text:
        raise HTTPException(status_code=400, detail="Resume text is required.")

    try:
        result = await suggest_resume_improvements(resume_text, job_description)
        if not result:
            raise HTTPException(status_code=500, detail="LLM failed to return valid suggestions.")
        return {
            "status": True,
            "message": "Improvement suggestions generated.",
            "suggestions": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
