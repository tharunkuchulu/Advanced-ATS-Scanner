from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_parser import extract_text_from_pdf

router = APIRouter(
    prefix="/upload_resume",
    tags=["Upload Resume"]
)

@router.post("/")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()
    extracted_text = extract_text_from_pdf(file_bytes)

    if not extracted_text:
        raise HTTPException(status_code=500, detail="Failed to extract text from resume.")

    return {
        "filename": file.filename,
        "content": extracted_text[:500] + "...",  # preview only
        "length": len(extracted_text)
    }
# This endpoint allows users to upload a resume in PDF format,
# extracts the text from it, and returns a preview of the content along with its length.