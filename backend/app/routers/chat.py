from fastapi import APIRouter, HTTPException, Header, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.supabase_client import supabase
from app.embeddings import get_query_embedding
from app.openrouter import stream_answer
from app.rate_limit import limiter
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

async def search_chunks(query: str, user_id: str, doc_id: str, top_k: int = 5) -> list[dict]:
    embedding = await get_query_embedding(query)

    res = supabase.rpc("search_chunks", {
        "query_embedding": embedding,
        "match_user_id": user_id,
        "match_document_id": doc_id,
        "match_count": top_k,
    }).execute()

    return res.data or []

@router.post("/{doc_id}")
@limiter.limit("10/minute")
async def chat(
    request: Request,
    doc_id: str,
    body: ChatRequest,
    authorization: str = Header(...)
):
    token = authorization.replace("Bearer ", "")
    user_id = get_user_id_from_token(token)

    res = supabase.table("documents")\
        .select("id")\
        .eq("id", doc_id)\
        .eq("user_id", user_id)\
        .single()\
        .execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Document not found")

    chunks = await search_chunks(body.message, user_id, doc_id)

    if not chunks:
        chunks_res = supabase.table("document_chunks")\
            .select("content, chunk_index")\
            .eq("document_id", doc_id)\
            .eq("user_id", user_id)\
            .order("chunk_index")\
            .limit(5)\
            .execute()
        chunks = chunks_res.data or []

    context = "\n\n---\n\n".join([c["content"] for c in chunks])
    sources = [{"content": c["content"][:200], "chunk_index": c["chunk_index"]} for c in chunks]

    return StreamingResponse(
        stream_answer(context, body.message, body.history, sources),
        media_type="text/event-stream",
    )
