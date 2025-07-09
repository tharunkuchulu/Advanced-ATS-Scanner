from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

def generate_pdf(analysis: dict, resume_filename: str) -> BytesIO:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    pdf.setTitle("Resume Analysis Report")
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, height - 50, "Resume Analysis Report")

    pdf.setFont("Helvetica", 12)
    pdf.drawString(50, height - 80, f"Filename: {resume_filename}")
    pdf.drawString(50, height - 100, f"Job Fit Score: {analysis.get('job_fit_score', 'N/A')}")

    y = height - 130
    pdf.drawString(50, y, "Summary:")
    y -= 20
    for line in analysis.get("summary", "").split("\n"):
        pdf.drawString(60, y, line)
        y -= 15

    y -= 10
    pdf.drawString(50, y, "Skills:")
    y -= 20
    for skill in analysis.get("skills", []):
        pdf.drawString(60, y, f"- {skill}")
        y -= 15

    y -= 10
    pdf.drawString(50, y, "Suggestions:")
    y -= 20
    for suggestion in analysis.get("suggestions", []):
        pdf.drawString(60, y, f"- {suggestion}")
        y -= 15

    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer
