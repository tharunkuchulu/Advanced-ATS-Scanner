from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, EmailStr
from datetime import timedelta
from jose import JWTError
import random

from app.auth.auth_handler import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    decode_token
)
from app.auth.auth_schemas import UserSignup, UserLogin
from app.db.database import db
from app.utils.email_utils import send_verification_email

from slowapi.util import get_remote_address
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# Temporary in-memory OTP store (use DB or Redis in prod)
OTP_STORE = {}

# --- Register Route ---
@router.post("/register")
async def register(user: UserSignup):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists.")
    hashed = get_password_hash(user.password)
    await db.users.insert_one({
        "full_name": user.full_name,
        "email": user.email,
        "password": hashed,
        "email_verified": False  # Mark as unverified initially
    })
    return {"msg": "User registered"}

# --- Login Route with Rate Limiting ---
@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, user: UserLogin):
    found = await db.users.find_one({"email": user.email})
    if not found or not verify_password(user.password, found["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Optional: Block login if email not verified
    if not found.get("email_verified", False):
        raise HTTPException(status_code=403, detail="Please verify your email before logging in.")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

# --- Change Password ---
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/change-password")
async def change_password(
    data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    email = current_user["sub"]
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if not verify_password(data.current_password, user["password"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect.")
    new_hashed = get_password_hash(data.new_password)
    await db.users.update_one({"email": email}, {"$set": {"password": new_hashed}})
    return {"message": "Password updated successfully."}

# --- Forgot Password ---
class ForgotPasswordRequest(BaseModel):
    email: str

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")
    reset_token = create_access_token(
        {"sub": data.email}, expires_delta=timedelta(minutes=15)
    )
    return {
        "message": "Password reset token generated.",
        "reset_token": reset_token
    }

# --- Reset Password ---
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    try:
        payload = decode_token(data.token)
        if not payload or "sub" not in payload:
            raise HTTPException(status_code=403, detail="Invalid or expired token")
        email = payload["sub"]
        user = await db.users.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        hashed = get_password_hash(data.new_password)
        await db.users.update_one({"email": email}, {"$set": {"password": hashed}})
        return {"message": "Password reset successful."}
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid or expired token")

# --- Send Email Verification ---
class EmailSchema(BaseModel):
    email: EmailStr

@router.post("/send-verification")
async def send_verification(data: EmailSchema):
    otp = str(random.randint(100000, 999999))
    OTP_STORE[data.email] = otp
    await send_verification_email(data.email, otp)
    return {"message": "Verification code sent to email."}

# --- Verify Email OTP ---
class VerifyRequest(BaseModel):
    email: EmailStr
    otp: str

@router.post("/verify-email")
async def verify_email(data: VerifyRequest):
    if OTP_STORE.get(data.email) == data.otp:
        await db.users.update_one({"email": data.email}, {"$set": {"email_verified": True}})
        OTP_STORE.pop(data.email, None)
        return {"message": "Email verified successfully."}
    raise HTTPException(status_code=400, detail="Invalid or expired verification code.")
