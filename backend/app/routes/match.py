from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.auth.auth_handler import get_current_user
from app.utils.llm_utils import match_resume_with_jd

router = APIRouter()

class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/match_resume/")
async def match_resume(data: MatchRequest, current_user: dict = Depends(get_current_user)):
    result = await match_resume_with_jd(data.resume_text, data.job_description)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to match resume")
    return result.dict()
