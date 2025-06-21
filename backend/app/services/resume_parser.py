import pdfplumber
import io
from typing import Optional

def extract_text_from_pdf(file_bytes: bytes) -> Optional[str]:
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            text = ''
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'
        return text.strip()
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return None
