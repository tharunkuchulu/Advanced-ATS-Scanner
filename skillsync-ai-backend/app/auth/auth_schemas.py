from pydantic import BaseModel, EmailStr
from pydantic import validator

class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str

    @validator('password')
    def password_strength(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        # Add more rules if needed
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str
