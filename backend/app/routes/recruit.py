# app/routes/recruit.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
from datetime import datetime
from bson import ObjectId
from app.utils.resume_parser import parse_resume
from app.utils.jd_matcher import match_resume_to_jd
from app.db.database import db

router = APIRouter()


@router.post("/recruit/bulk-match")
async def bulk_match(
    jd_text: str = Form(...),
    resumes: List[UploadFile] = File(...)
):
    results = []

    for resume in resumes:
        try:
            content = await resume.read()

            parsed = parse_resume(content)
            resume_text = parsed.get("parsed_text", "")

            if not resume_text.strip():
                raise ValueError("Empty or invalid resume content")

            # Get AI match result
            match_result = await match_resume_to_jd(resume_text, jd_text)

            record = {
                "resume_name": resume.filename,
                "jd_text": jd_text,
                "match_score": match_result.get("match_score", 0),
                "matching_skills": match_result.get("matching_skills", []),
                "missing_skills": match_result.get("missing_skills", []),
                "strengths": match_result.get("strengths", []),
                "weaknesses": match_result.get("weaknesses", []),
                "fit_statement": match_result.get("fit_statement", ""),
                "parsed_resume": parsed,
                "created_at": datetime.utcnow()
            }

            # Insert into DB and ignore ObjectId in response
            await db.matches.insert_one(record)

            # Return only serializable fields
            results.append({
                "resume_name": record["resume_name"],
                "match_score": record["match_score"],
                "matching_skills": record["matching_skills"],
                "missing_skills": record["missing_skills"],
                "strengths": record["strengths"],
                "weaknesses": record["weaknesses"],
                "fit_statement": record["fit_statement"]
            })

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing {resume.filename}: {str(e)}")

    return {
        "status": True,
        "message": "Batch analysis completed",
        "matches": results
    }
