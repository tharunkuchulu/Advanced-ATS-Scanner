# app/routes/recruit.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from app.utils.resume_parser import parse_resume
from app.db.database import db
import pprint
from app.utils.llm_utils import match_resume_with_jd

router = APIRouter()

@router.post("/recruit/bulk-match")
async def bulk_match(
    jd_text: str = Form(...),
    resumes: List[UploadFile] = File(...)
):
    # ✅ Enforce 50-file upload limit
    if len(resumes) > 50:
        raise HTTPException(status_code=400, detail="You can upload a maximum of 50 resumes at once.")

    results = []

    for resume in resumes:
        try:
            content = await resume.read()

            # ✅ File type & size validation
            if resume.content_type not in ["application/pdf", "text/plain"]:
                raise HTTPException(status_code=400, detail=f"File {resume.filename} is not PDF/TXT.")
            if len(content) > 5 * 1024 * 1024:
                raise HTTPException(status_code=400, detail=f"File {resume.filename} too large (max 5MB).")

            parsed = parse_resume(content, resume.filename)
            resume_text = parsed.get("parsed_text", "")
            if not resume_text.strip():
                raise ValueError("Empty or invalid resume content")

            # ✅ AI match
            match_result = await match_resume_with_jd(resume_text, jd_text)

            record = {
                "resume_name": resume.filename,
                "jd_text": jd_text,
                "fit_percentage": match_result.get("fit_percentage", 0),
                "matching_skills": match_result.get("matching_skills", []),
                "missing_skills": match_result.get("missing_skills", []),
                "strengths": match_result.get("strengths", []),
                "weaknesses": match_result.get("weaknesses", []),
                "verdict": match_result.get("verdict", ""),
                "parsed_resume": parsed,
                "created_at": datetime.utcnow()
            }

            await db.matches.insert_one(record)

            results.append({
                "resume_name": record["resume_name"],
                "fit_percentage": record["fit_percentage"],
                "matching_skills": record["matching_skills"],
                "missing_skills": record["missing_skills"],
                "strengths": record["strengths"],
                "weaknesses": record["weaknesses"],
                "verdict": record["verdict"]
            })

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing {resume.filename}: {str(e)}")

    return {
        "status": True,
        "message": "Batch analysis completed",
        "matches": results
    }


@router.get("/recruit/filter-matches")
async def filter_matches(
    min_score: int = Query(0, ge=0, le=100),
    max_score: int = Query(100, ge=0, le=100),
    skills: Optional[List[str]] = Query(None),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    sort_by: str = Query("fit_percentage", pattern="^(fit_percentage|created_at)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$")
):
    query = {
        "fit_percentage": {"$gte": min_score, "$lte": max_score}
    }

    if skills:
        query["$or"] = [
            {
                "matching_skills": {
                    "$elemMatch": {
                        "$regex": f"^{skill}$",
                        "$options": "i"
                    }
                }
            }
            for skill in skills
        ]

    if start_date and end_date:
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            query["created_at"] = {"$gte": start, "$lte": end}
        except ValueError:
            return {"status": False, "message": "Invalid date format. Use YYYY-MM-DD"}

    sort_field = "fit_percentage" if sort_by == "fit_percentage" else "created_at"
    sort_direction = -1 if sort_order == "desc" else 1

    print("📦 Final Mongo Query:")
    pprint.pprint(query)

    try:
        results_cursor = db.matches.find(query).sort(sort_field, sort_direction)
        raw_results = await results_cursor.to_list(length=None)

        results = []
        for item in raw_results:
            item["_id"] = str(item["_id"])
            results.append(item)
        
        return {
            "status": True,
            "total_matches": len(results),
            "filtered_results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
