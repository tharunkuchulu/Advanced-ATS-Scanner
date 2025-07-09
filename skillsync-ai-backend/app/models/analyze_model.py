from typing import List, Optional
from pydantic import BaseModel

class ResumeText(BaseModel):
    text: str
    filename: str

class ResumeHistoryItem(BaseModel):
    resume_id: str
    filename: str
    uploaded_at: str
    job_fit_score: Optional[int] = None

class ResumeHistoryResponse(BaseModel):
    resumes: List[ResumeHistoryItem]
