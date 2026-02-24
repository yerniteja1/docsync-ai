from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.pocketbase import get_document
from app.openrouter import ask_document

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    history: list = []

@router.post("/{doc_id}")
async def chat(
    doc_id: str,
    body: ChatRequest,
    authorization: str = Header(...)
):
    token = authorization.replace("Bearer ", "")

    status, doc = await get_document(doc_id, token)
    if status != 200:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        reply = await ask_document(
            document_content=doc["content"],
            question=body.message,
            history=body.history
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"reply": reply}