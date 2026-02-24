import httpx
from app.config import POCKETBASE_URL

async def register_user(name: str, email: str, password: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{POCKETBASE_URL}/api/collections/users/records",
            json={
                "name": name,
                "email": email,
                "password": password,
                "passwordConfirm": password,
            }
        )
        return response.status_code, response.json()

async def login_user(email: str, password: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{POCKETBASE_URL}/api/collections/users/auth-with-password",
            json={
                "identity": email,
                "password": password,
            }
        )
        return response.status_code, response.json()