from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from app.pocketbase import create_document, get_user_documents, get_current_user, get_document, delete_document
import PyPDF2
import io

router = APIRouter(prefix="/documents", tags=["documents"])

def extract_text(file_bytes: bytes, filename: str) -> str:
    if filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text.strip()
    elif filename.endswith(".txt"):
        return file_bytes.decode("utf-8").strip()
    else:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    authorization: str = Header(...)
):
    token = authorization.replace("Bearer ", "")

    # Get current user id from token
    user_status, user_data = await get_current_user(token)
    if user_status != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user_id = user_data["record"]["id"]

    file_bytes = await file.read()
    text = extract_text(file_bytes, file.filename)

    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    title = file.filename.rsplit(".", 1)[0]
    status, data = await create_document(title=title, content=text, token=token, user_id=user_id)

    if status != 200:
        raise HTTPException(status_code=status, detail=str(data))

    return {
        "id": data["id"],
        "title": data["title"],
        "created": data["created"]
    }

@router.get("/")
async def list_documents(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    status, data = await get_user_documents(token)
    if status != 200:
        raise HTTPException(status_code=status, detail=data)
    return data["items"]
  

@router.get("/{doc_id}")
async def get_single_document(doc_id: str, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    status, data = await get_document(doc_id, token)
    if status != 200:
        raise HTTPException(status_code=404, detail="Document not found")
    return data

@router.delete("/{doc_id}")
async def remove_document(doc_id: str, authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    status = await delete_document(doc_id, token)
    if status != 204:
        raise HTTPException(status_code=status, detail="Failed to delete document")
    return {"message": "Document deleted"}