from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_utils import analyze_resume_text
    
router = APIRouter()

class AnalyzeRequest(BaseModel):
    resume_text: str

@router.post("/analyze_resume/")
async def analyze_resume(data: AnalyzeRequest):
    result = await analyze_resume_text(data.resume_text)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to analyze resume")
    return result.dict()
