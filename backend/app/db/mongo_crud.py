from .database import db
from datetime import datetime
from bson import ObjectId

async def save_resume_analysis(user_email: str, filename: str, resume_doc: dict):
    from datetime import datetime

    # Count how many resumes with the same filename exist for this user
    existing_count = await db.resumes.count_documents({
        "user_email": user_email,
        "filename": filename
    })

    version = f"v{existing_count + 1}"

    resume_doc.update({
        "user_email": user_email,
        "filename": filename,
        "version": version,
        "uploaded_at": datetime.utcnow(),
        "analysis": resume_doc.get("analysis", {})
    })

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

# In mongo_crud.py (add helper function)
async def get_latest_resume_version(user_email: str, filename: str) -> int:
    latest = await db.resumes.find_one(
        {"user_email": user_email, "filename": filename},
        sort=[("version", -1)]
    )
    return latest["version"] + 1 if latest else 1
