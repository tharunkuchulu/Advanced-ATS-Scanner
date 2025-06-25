# app/utils/resume_parser.py

import fitz  # PyMuPDF

def parse_resume(file_bytes: bytes):
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        word_count = len(text.split())
        return {
            "parsed_text": text,
            "word_count": word_count
        }
    except Exception as e:
        return {
            "parsed_text": "",
            "word_count": 0,
            "error": str(e)
        }
