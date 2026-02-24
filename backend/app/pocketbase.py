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

async def get_current_user(token: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{POCKETBASE_URL}/api/collections/users/auth-refresh",
            headers={"Authorization": f"Bearer {token}"}
        )
        return response.status_code, response.json()

async def create_document(title: str, content: str, token: str, user_id: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{POCKETBASE_URL}/api/collections/documents/records",
            json={
                "title": title,
                "content": content,
                "user": user_id,
            },
            headers={"Authorization": token}
        )
        return response.status_code, response.json()

async def get_user_documents(token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{POCKETBASE_URL}/api/collections/documents/records",
            params={"sort": "-created"},
            headers={"Authorization": token}
        )
        return response.status_code, response.json()