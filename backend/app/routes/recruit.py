# app/routes/recruit.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.utils.resume_parser import parse_resume
from app.utils.jd_matcher import match_resume_to_jd
from app.db.database import db
from fastapi import Query
from datetime import datetime
import pprint

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

@router.get("/recruit/filter-matches")
async def filter_matches(
    min_score: int = Query(0, ge=0, le=100),
    max_score: int = Query(100, ge=0, le=100),
    skills: Optional[List[str]] = Query(None),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    sort_by: str = Query("match_score", pattern="^(match_score|created_at)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$")
):
    query = {
        "match_score": {"$gte": min_score, "$lte": max_score}
    }

    # ✅ Handle skill filtering with $or and regex
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

    # ✅ Handle date range filtering
    if start_date and end_date:
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            query["created_at"] = {"$gte": start, "$lte": end}
        except ValueError:
            return {"status": False, "message": "Invalid date format. Use YYYY-MM-DD"}

    # ✅ Determine sort field
    sort_field = "match_score" if sort_by == "match_score" else "created_at"
    sort_direction = -1 if sort_order == "desc" else 1

    # ✅ Debug query output
    print("📦 Final Mongo Query:")
    pprint.pprint(query)

    try:
        results_cursor = db.matches.find(query).sort(sort_field, sort_direction)
        raw_results = await results_cursor.to_list(length=None)

# Strip non-serializable ObjectId
        results = []
        for item in raw_results:
            item["_id"] = str(item["_id"])  # Convert ObjectId to string
            results.append(item)
        
        return {
            "status": True,
            "total_matches": len(results),
            "filtered_results": results
        }


    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
