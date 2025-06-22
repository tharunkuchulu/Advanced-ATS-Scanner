from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.services.ai_engine import match_resume_with_job
from app.auth.auth_handler import get_current_user

router = APIRouter()

class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/match_resume/")
async def match_resume(data: MatchRequest, current_user: dict = Depends(get_current_user)):
    result = await match_resume_with_job(data.resume_text, data.job_description)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to match resume")
    return result
