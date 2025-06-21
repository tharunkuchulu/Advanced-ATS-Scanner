from pydantic import BaseModel

class ResumeText(BaseModel):
    text: str
    filename: str