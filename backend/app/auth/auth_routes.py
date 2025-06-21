from fastapi import APIRouter, HTTPException
from app.auth.auth_handler import get_password_hash, verify_password, create_access_token
from app.auth.auth_schemas import UserSignup, UserLogin
from app.db.database import db

router = APIRouter()

@router.post("/register")
async def register(user: UserSignup):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists.")
    hashed = get_password_hash(user.password)
    await db.users.insert_one({"email": user.email, "password": hashed})
    return {"msg": "User registered"}

@router.post("/login")
async def login(user: UserLogin):
    found = await db.users.find_one({"email": user.email})
    if not found or not verify_password(user.password, found["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
