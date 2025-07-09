from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_utils import suggest_resume_improvements

router = APIRouter()

class InsightRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/get-insights")
async def get_insights(data: InsightRequest):
    try:
        result = await suggest_resume_improvements(data.resume_text, data.job_description)
        if not result:
            raise HTTPException(status_code=500, detail="LLM did not return valid insights.")
        return {
            "status": True,
            "insights": result.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")
