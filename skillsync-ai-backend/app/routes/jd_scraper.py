from fastapi import APIRouter, HTTPException, Query, Depends
from app.auth.auth_handler import get_current_user
from app.utils.jd_scrapers import (
    extract_jd_from_linkedin,
    extract_from_indeed,
    extract_from_google_jobs
)

router = APIRouter()

@router.get("/extract_jd_from_linkedin/")
async def extract_jd_linkedin(
    url: str = Query(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        jd_text = await extract_jd_from_linkedin(url)

        if not jd_text or len(jd_text.strip()) < 30:
            return {
                "status": False,
                "message": "JD extraction from LinkedIn is not available at the moment.",
                "job_description": None
            }

        return {"status": True, "message": "JD extracted successfully.", "job_description": jd_text}

    except Exception:
        return {
            "status": False,
            "message": "JD extraction from LinkedIn is not available at the moment.",
            "job_description": None
        }

@router.get("/extract_jd_from_indeed/")
async def extract_jd_indeed(
    url: str = Query(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        jd_text = await extract_from_indeed(url)

        if not jd_text or len(jd_text.strip()) < 30:
            return {
                "status": False,
                "message": "JD extraction from Indeed is not available at the moment.",
                "job_description": None
            }

        return {"status": True, "message": "JD extracted successfully.", "job_description": jd_text}

    except Exception:
        return {
            "status": False,
            "message": "JD extraction from Indeed is not available at the moment.",
            "job_description": None
        }

@router.get("/extract_jd_from_google_jobs/")
async def extract_jd_google(
    url: str = Query(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        jd_text = await extract_from_google_jobs(url)

        if not jd_text or len(jd_text.strip()) < 30:
            return {
                "status": False,
                "message": "JD extraction from Google Jobs is not available at the moment.",
                "job_description": None
            }

        return {"status": True, "message": "JD extracted successfully.", "job_description": jd_text}

    except Exception:
        return {
            "status": False,
            "message": "JD extraction from Google Jobs is not available at the moment.",
            "job_description": None
        }
