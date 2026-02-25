from dotenv import load_dotenv
import os

load_dotenv()

APP_ENV = os.getenv("APP_ENV", "development")
POCKETBASE_URL = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
ALLOWED_ORIGINS = [origin.strip() for origin in origins_raw.split(",")]