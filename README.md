# DocSync AI

An AI-powered document Q&A SaaS app. Upload any PDF or text file and chat with it using AI.

## Live Demo
- Frontend: (coming soon)
- Backend API Docs: (coming soon)

> Note: Backend is hosted on Render free tier and may take 30-50 seconds to wake up on first request.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database & Auth:** PocketBase
- **AI:** OpenRouter API (Mistral 7B)
- **Deployment:** Vercel (frontend) + Render (backend + PocketBase)
- **Containerization:** Docker

## Local Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker (optional)

### Running locally

**PocketBase:**
```bash
cd backend/pocketbase && ./pocketbase serve
```

**Backend:**
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Running with Docker
```bash
docker compose up --build
```

## Environment Variables

**Backend:**
| Variable | Description |
|----------|-------------|
| APP_ENV | development or production |
| POCKETBASE_URL | PocketBase server URL |
| OPENROUTER_API_KEY | Your OpenRouter API key |
| ALLOWED_ORIGINS | Comma separated list of allowed frontend URLs |

**Frontend:**
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |