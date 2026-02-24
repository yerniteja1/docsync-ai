from dotenv import load_dotenv
import os

load_dotenv()

APP_ENV = os.getenv("APP_ENV", "development")
POCKETBASE_URL = os.getenv("POCKETBASE_URL", "http://127.0.0.1:8090")