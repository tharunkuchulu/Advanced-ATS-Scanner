# app/routes/dashboard.py

from fastapi import APIRouter, Depends, HTTPException
from app.auth.auth_handler import get_current_user
from app.db.database import db
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    try:
        user_email = current_user["sub"]

        resumes_analyzed = await db.resumes.count_documents({"user_email": user_email})
        job_descriptions = await db.job_descriptions.count_documents({"user_email": user_email})
        matches_created = await db.analysis.count_documents({"user_id": user_email})
        reports_generated = matches_created  # Assuming each match has a downloadable report

        return {
            "status": True,
            "data": {
                "resumes_analyzed": resumes_analyzed,
                "job_descriptions": job_descriptions,
                "matches_created": matches_created,
                "reports_generated": reports_generated
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard stats: {str(e)}")
