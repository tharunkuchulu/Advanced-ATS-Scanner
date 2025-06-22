from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.analyze_model import ResumeText
from app.services.ai_engine import analyze_resume_text
from app.db.mongo_crud import save_resume_analysis, save_analysis_result
from app.auth.auth_handler import get_current_user
from datetime import datetime
from typing import Dict
from bson import ObjectId
from app.db.database import db
from fastapi.responses import StreamingResponse
from app.utils.pdf_generator import generate_pdf
from app.services.jd_matcher import match_resume_with_jd
from pydantic import BaseModel
import csv
from io import StringIO
from typing import Optional
from app.models.analyze_model import ResumeHistoryResponse
from app.models.analyze_model import ResumeHistoryItem

router = APIRouter()

class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/analyze_resume/")
async def analyze_resume(
    resume: ResumeText,
    current_user: dict = Depends(get_current_user)
):
    try:
        analysis = await analyze_resume_text(resume.text)
        if not isinstance(analysis, dict):
            raise HTTPException(status_code=500, detail="AI did not return a valid JSON response")

        resume_doc = {
            "filename": resume.filename,
            "resume_text": resume.text,
            "uploaded_at": datetime.utcnow()
        }
        resume_id = await save_resume_analysis(current_user["sub"], resume.filename, resume_doc)

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
        resume_result = await db.resumes.find_one({
            "_id": ObjectId(resume_id),
            "user_email": current_user["sub"]
        })

        if not resume_result:
            raise HTTPException(status_code=404, detail="Resume not found")

        analysis_result = await db.analysis.find_one({
            "resume_id": resume_id,
            "user_id": current_user["sub"]
        })

        if analysis_result is None:
            analysis_result = {}
        else:
            analysis_result = {k: v for k, v in analysis_result.items() if k != "_id"}

        return {
            "filename": resume_result.get("filename", "unknown"),
            "uploaded_at": resume_result["uploaded_at"],
            "analysis": analysis_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve results: {str(e)}")

@router.get("/resume_history/")
async def resume_history(current_user: dict = Depends(get_current_user)):
    try:
        cursor = db.resumes.find({"user_email": current_user["sub"]})
        resumes = []
        async for doc in cursor:
            resumes.append({
                "resume_id": str(doc["_id"]),
                "filename": doc["filename"],
                "uploaded_at": doc["uploaded_at"]
            })
        return {"resumes": resumes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")

@router.get("/resume_versions/")
async def get_resume_versions(filename: str, current_user: dict = Depends(get_current_user)):
    try:
        docs = db.resumes.find({
            "user_email": current_user["sub"],
            "filename": filename
        }).sort("uploaded_at", -1)

        resumes = []
        async for doc in docs:
            resumes.append({
                "resume_id": str(doc["_id"]),
                "filename": doc["filename"],
                "version": doc.get("version", "v1"),
                "uploaded_at": doc["uploaded_at"].isoformat()
            })

        return {"versions": resumes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching resume versions: {str(e)}")

@router.get("/export_pdf/")
async def export_analysis_pdf(resume_id: str, current_user: dict = Depends(get_current_user)):
    try:
        resume = await db.resumes.find_one({
            "_id": ObjectId(resume_id),
            "user_email": current_user["sub"]
        })

        analysis = await db.analysis.find_one({
            "resume_id": resume_id,
            "user_id": current_user["sub"]
        })

        if not resume or not analysis:
            raise HTTPException(status_code=404, detail="Resume or analysis not found")

        pdf_stream = generate_pdf(analysis, resume["filename"])
        return StreamingResponse(pdf_stream, media_type="application/pdf", headers={
            "Content-Disposition": f"attachment; filename=analysis_{resume_id}.pdf"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export PDF: {str(e)}")

@router.post("/match_resume/")
async def match_resume_to_jd(
    resume_id: str = Query(...),
    jd_id: str = Query(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        resume_doc = await db.resumes.find_one({
            "_id": ObjectId(resume_id),
            "user_email": current_user["sub"]
        })
        if not resume_doc:
            raise HTTPException(status_code=404, detail="Resume not found")

        jd_doc = await db.job_descriptions.find_one({
            "_id": ObjectId(jd_id),
            "user_email": current_user["sub"]
        })
        if not jd_doc:
            raise HTTPException(status_code=404, detail="Job Description not found")

        match_result = await match_resume_with_jd(resume_doc["resume_text"], jd_doc["text"])
        if not match_result:
            raise HTTPException(status_code=500, detail="Failed to generate match result")

        return {
            "resume_filename": resume_doc["filename"],
            "jd_filename": jd_doc["filename"],
            "match_analysis": match_result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")

@router.post("/match_resume_raw/", tags=["Resume Matching"])
async def match_resume_by_text(
    match_input: MatchRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        result = await match_resume_with_jd(match_input.resume_text, match_input.job_description)
        if not result:
            raise HTTPException(status_code=500, detail="AI failed to return valid match results.")
        return {"match_result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")

@router.get("/export_csv/")
async def export_all_resume_data_csv(current_user: dict = Depends(get_current_user)):
    try:
        # Fetch resumes by user
        resumes_cursor = db.resumes.find({"user_email": current_user["sub"]})
        analyses_cursor = db.analysis.find({"user_id": current_user["sub"]})

        # Create dictionaries to map resume_id -> resume
        resumes_map = {}
        async for resume in resumes_cursor:
            resumes_map[str(resume["_id"])] = resume

        # Prepare CSV
        csv_output = StringIO()
        writer = csv.writer(csv_output)
        writer.writerow([
            "Resume Filename", "Version", "Uploaded At", 
            "Skills", "Summary", "Suggestions", "Job Fit Score"
        ])

        async for analysis in analyses_cursor:
            resume_id = analysis.get("resume_id")
            resume = resumes_map.get(resume_id)
            if resume:
                writer.writerow([
                    resume.get("filename", "N/A"),
                    resume.get("version", "v1"),
                    resume.get("uploaded_at", "").isoformat(),
                    ", ".join(analysis.get("skills", [])),
                    analysis.get("summary", ""),
                    " | ".join(analysis.get("suggestions", [])),
                    analysis.get("job_fit_score", "")
                ])

        csv_output.seek(0)
        return StreamingResponse(
            iter([csv_output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=resume_data.csv"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export CSV: {str(e)}")
    
@router.get("/resume_history/", response_model=ResumeHistoryResponse)
async def resume_history(
    filename: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    min_score: Optional[int] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    try:
        filters = {"user_email": current_user["sub"]}
        
        if filename:
            filters["filename"] = filename

        if from_date:
            from datetime import datetime
            filters["uploaded_at"] = {"$gte": datetime.fromisoformat(from_date)}

        resume_cursor = db.resumes.find(filters)
        resumes = []

        async for resume in resume_cursor:
            resume_id = str(resume["_id"])
            uploaded_at = resume["uploaded_at"].isoformat()

            analysis = await db.analysis.find_one({
                "resume_id": resume_id,
                "user_id": current_user["sub"]
            })

            job_fit_score = analysis.get("job_fit_score") if analysis else None

            if min_score is not None and (job_fit_score is None or job_fit_score < min_score):
                continue

            resumes.append({
                "resume_id": resume_id,
                "filename": resume["filename"],
                "uploaded_at": uploaded_at,
                "job_fit_score": job_fit_score
            })

        return {"resumes": resumes}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch filtered history: {str(e)}")