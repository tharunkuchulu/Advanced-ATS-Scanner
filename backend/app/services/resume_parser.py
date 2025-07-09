import fitz  # PyMuPDF
import pdfplumber
import io

def parse_resume(file_bytes: bytes, filename: str = ""):
    """
    Tries to parse PDF using PyMuPDF first, then pdfplumber if needed.
    If it's a .txt file, decodes as utf-8.
    Returns {'parsed_text': ..., 'word_count': ...}
    """
    text = ""
    try:
        if filename.lower().endswith('.pdf'):
            try:
                # First try PyMuPDF
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                for page in doc:
                    text += page.get_text()
            except Exception as e:
                print("PyMuPDF failed, trying pdfplumber:", e)
                # Try pdfplumber as fallback
                try:
                    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                        for page in pdf.pages:
                            page_text = page.extract_text()
                            if page_text:
                                text += page_text + "\n"
                except Exception as e2:
                    print("Both parsers failed:", e2)
        elif filename.lower().endswith('.txt'):
            try:
                text = file_bytes.decode('utf-8')
            except Exception as e:
                print("TXT file decode failed:", e)
        else:
            print("Unsupported file type for:", filename)
    except Exception as e:
        print("Parse error:", e)
    word_count = len(text.split())
    return {
        "parsed_text": text,
        "word_count": word_count
    }
