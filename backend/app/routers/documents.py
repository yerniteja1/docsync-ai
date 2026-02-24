from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from app.pocketbase import create_document, get_user_documents
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
    file_bytes = await file.read()
    text = extract_text(file_bytes, file.filename)

    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    title = file.filename.rsplit(".", 1)[0]
    status, data = await create_document(title=title, content=text, token=token)

    if status != 200:
        raise HTTPException(status_code=status, detail=data)

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