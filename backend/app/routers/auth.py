from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/register")
async def register(body: RegisterRequest):
    try:
        res = supabase.auth.sign_up({
            "email": body.email,
            "password": body.password,
            "options": {
                "data": {"name": body.name}
            }
        })
        if res.user is None:
            raise HTTPException(status_code=400, detail="Registration failed")
        return {"message": "Account created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(body: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": body.email,
            "password": body.password
        })
        if res.user is None:
            raise HTTPException(status_code=400, detail="Invalid email or password")
        return {
            "token": res.session.access_token,
            "refresh_token": res.session.refresh_token,
            "user": {
                "id": res.user.id,
                "name": res.user.user_metadata.get("name", ""),
                "email": res.user.email,
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid email or password")

@router.post("/refresh")
async def refresh(body: RefreshRequest):
    try:
        res = supabase.auth.refresh_session({"refresh_token": body.refresh_token})
        if res.session is None:
            raise HTTPException(status_code=401, detail="Refresh failed")
        return {
            "token": res.session.access_token,
            "refresh_token": res.session.refresh_token,
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Refresh failed")

@router.get("/me")
async def me(authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "")
        res = supabase.auth.get_user(token)
        if res.user is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {
            "user": {
                "id": res.user.id,
                "name": res.user.user_metadata.get("name", ""),
                "email": res.user.email,
            }
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
