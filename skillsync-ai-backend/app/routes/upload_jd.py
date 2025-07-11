from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from datetime import datetime
from typing import Optional
from app.utils.resume_parser import parse_resume
from app.auth.auth_handler import get_current_user
from app.db.database import db

router = APIRouter(
    prefix="/upload_jd",
    tags=["Upload Job Description"]
)

@router.post("/")
async def upload_jd(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    # Validate file type and size
    if file.content_type not in ["application/pdf", "text/plain"]:
        raise HTTPException(status_code=400, detail="Only PDF or TXT files are allowed.")
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB).")

    # Use the unified parser for both PDF and TXT for consistency
    parsed = parse_resume(content, file.filename)
    jd_text = parsed.get("parsed_text", "")

    if not jd_text:
        raise HTTPException(status_code=400, detail="Failed to extract JD content.")

    jd_doc = {
        "user_email": current_user["sub"],
        "filename": file.filename,
        "jd_text": jd_text,
        "uploaded_at": datetime.utcnow()
    }

    result = await db.job_descriptions.insert_one(jd_doc)
    return {
        "message": "Job Description uploaded successfully",
        "jd_id": str(result.inserted_id),
        "filename": file.filename
    }

@router.get("/history/")
async def get_uploaded_jds(current_user: dict = Depends(get_current_user)):
    try:
        jd_docs = db.job_descriptions.find({"user_email": current_user["sub"]})
        history = []
        async for doc in jd_docs:
            history.append({
                "jd_id": str(doc["_id"]),
                "filename": doc["filename"],
                "uploaded_at": doc["uploaded_at"]
            })
        return {"job_descriptions": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching JD history: {str(e)}")
