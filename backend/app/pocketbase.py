import httpx
from app.config import POCKETBASE_URL


def _parse_response(response: httpx.Response):
    try:
        return response.json()
    except Exception:
        return {"text": response.text}


async def register_user(name: str, email: str, password: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{POCKETBASE_URL}/api/collections/users/records",
                json={
                    "name": name,
                    "email": email,
                    "password": password,
                    "passwordConfirm": password,
                },
            )
            return response.status_code, _parse_response(response)
    except httpx.RequestError as e:
        return 503, {"error": "PocketBase unreachable", "details": str(e)}


async def login_user(email: str, password: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{POCKETBASE_URL}/api/collections/users/auth-with-password",
                json={
                    "identity": email,
                    "password": password,
                },
            )
            return response.status_code, _parse_response(response)
    except httpx.RequestError as e:
        return 503, {"error": "PocketBase unreachable", "details": str(e)}


async def get_current_user(token: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{POCKETBASE_URL}/api/collections/users/auth-refresh",
                headers={"Authorization": f"Bearer {token}"},
            )
            return response.status_code, _parse_response(response)
    except httpx.RequestError as e:
        return 503, {"error": "PocketBase unreachable", "details": str(e)}


async def create_document(title: str, content: str, token: str, user_id: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{POCKETBASE_URL}/api/collections/documents/records",
                json={
                    "title": title,
                    "content": content,
                    "user": user_id,
                },
                headers={"Authorization": f"Bearer {token}"},
            )
            return response.status_code, _parse_response(response)
    except httpx.RequestError as e:
        return 503, {"error": "PocketBase unreachable", "details": str(e)}


async def get_user_documents(token: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{POCKETBASE_URL}/api/collections/documents/records",
                params={"sort": "-created"},
                headers={"Authorization": f"Bearer {token}"},
            )
            return response.status_code, _parse_response(response)
    except httpx.RequestError as e:
        return 503, {"error": "PocketBase unreachable", "details": str(e)}


async def get_document(doc_id: str, token: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{POCKETBASE_URL}/api/collections/documents/records/{doc_id}",
                headers={"Authorization": f"Bearer {token}"},
            )
            return response.status_code, _parse_response(response)
    except httpx.RequestError as e:
        return 503, {"error": "PocketBase unreachable", "details": str(e)}


async def delete_document(doc_id: str, token: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{POCKETBASE_URL}/api/collections/documents/records/{doc_id}",
                headers={"Authorization": f"Bearer {token}"},
            )
            return response.status_code
    except httpx.RequestError:
        return 503