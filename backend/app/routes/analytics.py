from fastapi import APIRouter, Depends, HTTPException
from app.auth.auth_handler import get_current_user
from app.db.database import db
from bson.son import SON
from collections import Counter

router = APIRouter()

@router.get("/analytics/summary", tags=["Analytics"])
async def get_resume_analytics(current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["sub"]

        # Get all analysis docs for this user
        cursor = db.analysis.find({"user_id": user_id})
        analyses = await cursor.to_list(length=None)

        if not analyses:
            return {
                "total_resumes": 0,
                "average_fit_score": 0,
                "top_skills": []
            }

        # Total resumes
        total_resumes = len(analyses)

        # Average fit score
        avg_score = sum(a.get("job_fit_score", 0) for a in analyses) / total_resumes

        # Collect skills
        all_skills = []
        for a in analyses:
            all_skills.extend(a.get("skills", []))
        top_skills = [skill for skill, _ in Counter(all_skills).most_common(5)]

        return {
            "total_resumes": total_resumes,
            "average_fit_score": round(avg_score, 2),
            "top_skills": top_skills
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics fetch failed: {str(e)}")
