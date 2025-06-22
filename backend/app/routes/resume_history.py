# app/routes/resume_history.py
from fastapi import APIRouter, Depends
from app.auth.auth_handler import get_current_user
from app.db.database import db
from bson import ObjectId

router = APIRouter()

@router.get("/resume_history/")
async def get_resume_history(user: dict = Depends(get_current_user)):
    resumes_cursor = db.resumes.find({"user_email": user["sub"]})
    resumes = []

    async for doc in resumes_cursor:
        resumes.append({
            "resume_id": str(doc["_id"]),
            "filename": doc["filename"],
            "uploaded_at": doc["uploaded_at"]
        })

    return {"resumes": resumes}
