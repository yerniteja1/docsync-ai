from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.supabase_client import supabase
from app.openrouter import ask_document
import jwt

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    history: list = []

def get_user_id_from_token(token: str) -> str:
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/{doc_id}")
async def chat(
    doc_id: str,
    body: ChatRequest,
    authorization: str = Header(...)
):
    token = authorization.replace("Bearer ", "")
    user_id = get_user_id_from_token(token)

    res = supabase.table("documents")\
        .select("*")\
        .eq("id", doc_id)\
        .eq("user_id", user_id)\
        .single()\
        .execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        reply = await ask_document(
            document_content=res.data["content"],
            question=body.message,
            history=body.history
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"reply": reply}