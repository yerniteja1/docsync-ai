from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import APP_ENV, ALLOWED_ORIGINS
from app.routers import auth, documents, chat

app = FastAPI(
    title="DocSync AI API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=".*" if APP_ENV == "development" else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "DocSync AI API is running", "env": APP_ENV}

@app.get("/health")
def health():
    from app.supabase_client import supabase
    try:
        supabase.table("documents").select("id").limit(1).execute()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "ok", "database": "error", "detail": str(e)}