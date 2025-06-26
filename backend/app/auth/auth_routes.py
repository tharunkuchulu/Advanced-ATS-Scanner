# app/routes/auth_routes.py

from fastapi import APIRouter, HTTPException, Request
from app.auth.auth_handler import get_password_hash, verify_password, create_access_token
from app.auth.auth_schemas import UserSignup, UserLogin
from app.db.database import db
from slowapi.util import get_remote_address
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

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
        "password": hashed
    })
    return {"msg": "User registered"}

# --- Login Route with Rate Limiting ---
@router.post("/login")
@limiter.limit("5/minute")  # Adjust as needed per security policy
async def login(request: Request, user: UserLogin):
    found = await db.users.find_one({"email": user.email})
    if not found or not verify_password(user.password, found["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
