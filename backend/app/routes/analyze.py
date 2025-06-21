from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.analyze_model import ResumeText
from app.services.ai_engine import analyze_resume_text
from app.db.mongo_crud import save_resume_analysis, save_analysis_result
from app.auth.auth_handler import get_current_user
from datetime import datetime
from typing import Dict
from bson import ObjectId
from app.db.database import db

router = APIRouter()

@router.post("/analyze_resume/")
async def analyze_resume(
    resume: ResumeText,
    current_user: dict = Depends(get_current_user)
):
    try:
        analysis = await analyze_resume_text(resume.text)
        if not isinstance(analysis, dict):
            raise HTTPException(status_code=500, detail="AI did not return a valid JSON response")

        # Save resume document to get resume_id
        resume_doc = {
            "filename": resume.filename,
            "resume_text": resume.text,
            "uploaded_at": datetime.utcnow()
        }
        resume_id = await save_resume_analysis(current_user["sub"], resume.filename, resume_doc)

        # Save analysis document
        analysis_doc = {
            "user_id": current_user["sub"],
            "resume_id": resume_id,
            "skills": analysis["skills"],
            "summary": analysis["summary"],
            "suggestions": analysis["suggestions"],
            "job_fit_score": analysis["job_fit_score"]
        }
        result = await db.analysis.insert_one(analysis_doc)
        print(f"Debug: Saved analysis for resume_id: {resume_id}, _id: {result.inserted_id}")

        return {
            "message": "Resume analyzed successfully",
            "resume_id": resume_id,
            "analysis": analysis
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/get_analysis_results/")
async def get_analysis_results(resume_id: str = Query(...), current_user: dict = Depends(get_current_user)):
    try:
        # Fetch resume document
        resume_result = await db.resumes.find_one({
            "_id": ObjectId(resume_id),
            "user_email": current_user["sub"]
        })

        if not resume_result:
            raise HTTPException(status_code=404, detail="Resume not found")

        # Fetch analysis document, handle if not found
        analysis_result = await db.analysis.find_one({
            "resume_id": resume_id,
            "user_id": current_user["sub"]
        })

        if analysis_result is None:
            print(f"Debug: No analysis found for resume_id: {resume_id}, user_id: {current_user['sub']}")
            analysis_result = {}
        else:
            # Convert analysis_result to a dict and exclude _id
            analysis_result = {k: v for k, v in analysis_result.items() if k != "_id"}

        return {
            "filename": resume_result.get("filename", "unknown"),
            "uploaded_at": resume_result["uploaded_at"],
            "analysis": analysis_result
        }
    except Exception as e:
        print(f"Debug: Error in get_analysis_results: {type(e).__name__} - {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve results: {str(e)}")