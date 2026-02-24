from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.pocketbase import register_user, login_user

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(body: RegisterRequest):
    status, data = await register_user(body.name, body.email, body.password)
    if status != 200:
        raise HTTPException(status_code=status, detail=data)
    return {"message": "Account created successfully"}

@router.post("/login")
async def login(body: LoginRequest):
    status, data = await login_user(body.email, body.password)
    if status != 200:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    return {
        "token": data["token"],
        "user": {
            "id": data["record"]["id"],
            "name": data["record"]["name"],
            "email": data["record"]["email"],
        }
    }