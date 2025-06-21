from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.models.user_model import UserCreate, UserLogin
from app.db.database import db
from app.auth.auth_handler import create_access_token  # Import from auth_handler

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Register
@router.post("/register/")
async def register(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = pwd_context.hash(user.password)
    user_data = {"email": user.email, "password": hashed_password}
    await db.users.insert_one(user_data)
    return {"message": "User registered successfully"}

# Login
@router.post("/login/")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {
        "sub": db_user["email"],
        "exp": datetime.utcnow() + timedelta(minutes=30)  # Match auth_handler.py
    }
    token = create_access_token(token_data)
    return {"access_token": token, "token_type": "bearer"}