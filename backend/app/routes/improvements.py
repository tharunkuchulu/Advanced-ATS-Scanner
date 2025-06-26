from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_utils import suggest_resume_improvements

router = APIRouter()

class SuggestImprovementRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/suggest-improvements")
async def suggest_improvements(data: SuggestImprovementRequest):
    try:
        result = await suggest_resume_improvements(data.resume_text, data.job_description)
        if not result:
            raise HTTPException(status_code=500, detail="LLM failed to return valid suggestions.")
        return {
            "status": True,
            "message": "Improvement suggestions generated.",
            "suggestions": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenRouter error: {str(e)}")
