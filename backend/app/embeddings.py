import httpx
from app.config import HUGGINGFACE_API_KEY

HF_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIM = 384
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50


def chunk_text(text: str) -> list[str]:
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + CHUNK_SIZE
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks


async def get_embeddings(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    headers = {}
    if HUGGINGFACE_API_KEY:
        headers["Authorization"] = f"Bearer {HUGGINGFACE_API_KEY}"

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            HF_API_URL,
            headers=headers,
            json={"inputs": texts},
        )

        if response.status_code != 200:
            raise Exception(f"HuggingFace API error: {response.text}")

        embeddings = response.json()

        if isinstance(embeddings, list) and len(embeddings) > 0:
            if isinstance(embeddings[0], list):
                return embeddings
            return [embeddings]

        raise Exception("Unexpected embedding response format")


async def get_query_embedding(text: str) -> list[float]:
    results = await get_embeddings([text])
    return results[0]
