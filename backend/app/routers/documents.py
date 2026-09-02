from fastapi import APIRouter, UploadFile, File, HTTPException, Header, Request
from app.supabase_client import supabase
from app.embeddings import chunk_text, get_embeddings
from app.rate_limit import limiter
import PyPDF2
from docx import Document as DocxDocument
import io
import jwt

router = APIRouter(prefix="/documents", tags=["documents"])

def get_user_id_from_token(token: str) -> str:
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

def extract_text(file_bytes: bytes, filename: str) -> str:
    if filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text.strip()
    elif filename.endswith(".docx"):
        doc = DocxDocument(io.BytesIO(file_bytes))
        return "\n".join([p.text for p in doc.paragraphs]).strip()
    elif filename.endswith(".txt"):
        return file_bytes.decode("utf-8").strip()
    else:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, and TXT files are supported")

@router.post("/upload")
@limiter.limit("5/minute")
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    authorization: str = Header(...)
):
    token = authorization.replace("Bearer ", "")
    user_id = get_user_id_from_token(token)

    file_bytes = await file.read()
    text = extract_text(file_bytes, file.filename)

    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    title = file.filename.rsplit(".", 1)[0]

    res = supabase.table("documents").insert({
        "title": title,
        "content": text,
        "user_id": user_id
    }).execute()

    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to save document")

    doc = res.data[0]
    doc_id = doc["id"]

    chunks = chunk_text(text)
    if chunks:
        embeddings = await get_embeddings(chunks)
        chunk_rows = [
            {
                "document_id": doc_id,
                "user_id": user_id,
                "content": chunk,
                "chunk_index": i,
                "embedding": embedding,
            }
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
        ]
        supabase.table("document_chunks").insert(chunk_rows).execute()

    return {
        "id": doc_id,
        "title": doc["title"],
        "created": doc["created_at"]
    }

@router.get("/")
async def list_documents(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = get_user_id_from_token(token)

    res = supabase.table("documents")\
        .select("id, title, created_at")\
        .eq("user_id", user_id)\
        .order("created_at", desc=True)\
        .execute()

    return [
        {"id": d["id"], "title": d["title"], "created": d["created_at"]}
        for d in res.data
    ]

@router.get("/{doc_id}")
async def get_single_document(doc_id: str, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = get_user_id_from_token(token)

    res = supabase.table("documents")\
        .select("*")\
        .eq("id", doc_id)\
        .eq("user_id", user_id)\
        .execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Document not found")

    return res.data[0]

@router.delete("/{doc_id}")
async def remove_document(doc_id: str, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    user_id = get_user_id_from_token(token)

    supabase.table("document_chunks")\
        .delete()\
        .eq("document_id", doc_id)\
        .eq("user_id", user_id)\
        .execute()

    supabase.table("documents")\
        .delete()\
        .eq("id", doc_id)\
        .eq("user_id", user_id)\
        .execute()

    return {"message": "Document deleted"}
