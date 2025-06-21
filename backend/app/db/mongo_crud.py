from .database import db
from datetime import datetime
from bson import ObjectId

async def save_resume_analysis(user_email: str, filename: str, resume_doc: dict):
    resume_doc = {
        "user_email": user_email,
        "filename": filename,
        "uploaded_at": datetime.utcnow(),
        "resume_text": resume_doc.get("resume_text", ""),
        "analysis": resume_doc.get("analysis", {})
    }
    result = await db.resumes.insert_one(resume_doc)
    return str(result.inserted_id)

async def get_analysis_by_resume_id(resume_id):
    from bson import ObjectId
    doc = await db.resumes.find_one({"_id": ObjectId(resume_id)})
    return doc

async def save_analysis_result(user_id, resume_id, analysis):
    analysis_doc = {
        "user_id": user_id,
        "resume_id": resume_id,
        "skills": analysis["skills"],
        "summary": analysis["summary"],
        "suggestions": analysis["suggestions"],
        "job_fit_score": analysis["job_fit_score"],
    }
    await db.analysis.insert_one(analysis_doc)