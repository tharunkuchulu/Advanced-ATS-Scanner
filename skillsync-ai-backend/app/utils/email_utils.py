from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
import os

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME"),
    MAIL_STARTTLS=True,     # ✅ NEW (required)
    MAIL_SSL_TLS=False,     # ✅ NEW (required)
    USE_CREDENTIALS=True
)

fm = FastMail(conf)

async def send_verification_email(email: str, otp: str):
    subject = "Verify your email for AI Resume Analyzer"
    body = f"""
    Hello,

    Your verification code is: {otp}

    Please enter this code in the app to verify your email address.

    This code is valid for 15 minutes.

    Thanks,
    AI Resume Analyzer Team
    """
    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=body,
        subtype="plain"
    )
    await fm.send_message(message)
