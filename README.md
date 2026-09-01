# DocSync AI

An AI-powered document Q&A SaaS app. Upload any document and chat with it using RAG (Retrieval-Augmented Generation) with streaming responses and source citations.

## Live Demo

- Frontend: https://docsync-ai.vercel.app
- Backend API Docs: https://docsync-backend.onrender.com/docs

> Note: Backend is on Render free tier and may take 30-50 seconds to wake up on first request.

## Features

- **RAG Pipeline**: Document ingestion → chunking → embedding → vector search → LLM generation
- **Streaming Responses**: Real-time SSE streaming from LLM with token-by-token output
- **Source Citations**: Responses include relevant document chunks with highlights
- **Multi-format Support**: PDF, DOCX, and TXT document uploads
- **Authentication**: Supabase JWT with auto-refresh, session persistence
- **Rate Limiting**: Per-endpoint rate limits (10/min chat, 5/min upload)
- **Error Tracking**: Sentry integration with structured JSON logging
- **CI/CD**: GitHub Actions pipeline with tests and automated deployment

## Architecture

```
        React (Vite + Tailwind)
                │
          nginx (Docker)
                │
           FastAPI (Python)
                │
    ┌───────────┼───────────┐
    ↓           ↓           ↓
 Supabase   pgvector    OpenRouter
 (Auth,     (Vector      (LLM -
  DB)        Search)     Free Models)
                │
                ↓
         HuggingFace
         (Embeddings)
```

**Pipeline:**
```
Upload → FastAPI → Parse → Chunk → Embed (HuggingFace) → Store (pgvector)
Query  → Embed → Vector Search (pgvector) → Context + LLM → Stream (SSE)
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + TypeScript + Vite + Tailwind CSS | UI, state management, SSE streaming |
| Backend | FastAPI (Python 3.11) | API, document processing, RAG pipeline |
| Database | Supabase (PostgreSQL + pgvector) | Auth, storage, vector search |
| Embeddings | HuggingFace Inference API (all-MiniLM-L6-v2, 384-dim) | Document & query embeddings |
| LLM | OpenRouter (free models) | Answer generation |
| Error Tracking | Sentry | Error monitoring |
| CI/CD | GitHub Actions | Tests, build, deployment |
| Container | Docker Compose | Local development |

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose (recommended)

### Running with Docker (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/docs

### Running without Docker

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in your keys
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

**Backend** (`backend/.env`):

| Variable | Description | Required |
|----------|-------------|----------|
| APP_ENV | `development` or `production` | Yes |
| SUPABASE_URL | Supabase project URL | Yes |
| SUPABASE_SERVICE_KEY | Supabase service role key | Yes |
| OPENROUTER_API_KEY | OpenRouter API key (free tier works) | Yes |
| HUGGINGFACE_API_KEY | HuggingFace read token (free) | Yes |
| ALLOWED_ORIGINS | Comma-separated frontend URLs | Yes |
| SENTRY_DSN | Sentry DSN for error tracking | No |

**Frontend** (`frontend/.env`):

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL (`/api` for Docker, full URL otherwise) | Yes |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Validate token, return user |
| POST | `/documents/upload` | Upload document (PDF/DOCX/TXT) |
| GET | `/documents/` | List user's documents |
| DELETE | `/documents/{id}` | Delete document |
| POST | `/chat/{doc_id}` | Chat with document (SSE stream) |
| GET | `/health` | Health check (pings Supabase) |

## Database Schema

**documents**: `id`, `user_id`, `title`, `content`, `created_at`

**document_chunks**: `id`, `document_id`, `user_id`, `content`, `embedding` (vector 384), `chunk_index`

**usage_logs**: `id`, `user_id`, `document_id`, `action`, `tokens_used`, `model`, `created_at`

**RPC**: `search_chunks(query_embedding, match_user_id, match_document_id, match_count)` — pgvector cosine similarity search

## Free Tier Constraints

| Service | Free Tier Limit |
|---------|----------------|
| Supabase | 500MB DB, 1GB storage, 50k MAU |
| OpenRouter | Free models (Llama, Nemotron, etc.) |
| HuggingFace | 30k tokens/min for inference |
| Render | 500hrs/mo (sleeps after ~15min idle) |
| Vercel | 100GB bandwidth |
| Sentry | 5k errors/mo |
| GitHub Actions | 2000 min/mo |

## Cold Start Handling

Free tier hosting (Render) sleeps after ~15min inactivity. Solutions built in:

1. **Retry Logic**: Frontend retries `/auth/me` up to 20 times (3s intervals) on network errors
2. **Keep-Alive Cron**: GitHub Actions workflow pings `/health` every 5 min (`.github/workflows/keep-alive.yml`)
3. **Health Endpoint**: `/health` queries Supabase to keep both services awake

## Testing

```bash
cd backend
pytest
```

Unit tests cover: embedding generation, text chunking, search chunks, auth validation, rate limiting.

## Deployment

- **Frontend**: Auto-deploys to Vercel on push to `main`
- **Backend**: Auto-deploys to Render on push to `main`
- **CI**: Lint → Test → Build (`.github/workflows/ci.yml`)
- **Keep-Alive**: Scheduled cron every 5 min (`.github/workflows/keep-alive.yml`)

## Project Structure

```
docsync-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, middleware, Sentry
│   │   ├── config.py            # Environment variables
│   │   ├── auth.py              # JWT auth helpers
│   │   ├── embeddings.py        # HuggingFace embedding pipeline
│   │   ├── openrouter.py        # LLM streaming via OpenRouter
│   │   ├── supabase_client.py   # Supabase client
│   │   ├── rate_limit.py        # SlowAPI rate limiting
│   │   ├── logging_config.py    # JSON structured logging
│   │   ├── usage.py             # Usage tracking
│   │   └── routers/
│   │       ├── auth.py          # Auth endpoints
│   │       ├── documents.py     # Upload/list/delete documents
│   │       └── chat.py          # RAG chat with SSE streaming
│   ├── migrations/
│   │   ├── 002_add_chunks.sql   # pgvector + document_chunks table
│   │   └── 003_add_usage.sql    # usage_logs table
│   ├── tests/
│   │   └── test_core.py         # Unit tests
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/               # Home, Login, Register, Dashboard, Chat
│   │   ├── lib/                 # api.ts, AuthContext, types, schemas
│   │   └── components/          # ErrorBoundary, PrivateRoute, etc.
│   ├── nginx.conf               # Reverse proxy to backend
│   └── Dockerfile
├── docker-compose.yml
├── .github/workflows/
│   ├── ci.yml                   # CI pipeline
│   └── keep-alive.yml           # Keep-alive cron
└── render.yaml                  # Render deployment config
```
