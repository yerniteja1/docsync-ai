from dotenv import load_dotenv
import os

load_dotenv()

APP_ENV = os.getenv("APP_ENV", "development")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
ALLOWED_ORIGINS = [origin.strip() for origin in origins_raw.split(",")]
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")