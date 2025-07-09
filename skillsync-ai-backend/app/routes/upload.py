from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.resume_parser import parse_resume

router = APIRouter(
    prefix="/upload_resume",
    tags=["Upload Resume"]
)

@router.post("/")
async def upload_resume(file: UploadFile = File(...)):
    file_bytes = await file.read()
    # File type and size validation
    if file.content_type not in ["application/pdf", "text/plain"]:
        raise HTTPException(status_code=400, detail="Only PDF or TXT files are supported.")
    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB).")

    parsed = parse_resume(file_bytes, file.filename)
    if not parsed["parsed_text"]:
        raise HTTPException(status_code=500, detail="Failed to extract text from resume.")

    return {
        "filename": file.filename,
        "content": parsed["parsed_text"][:500] + "...",  # preview only
        "length": parsed["word_count"]
    }
