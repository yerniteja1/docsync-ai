from huggingface_hub import InferenceClient
from app.config import HUGGINGFACE_API_KEY

MODEL = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIM = 384
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

_client = None


def _get_client() -> InferenceClient:
    global _client
    if _client is None:
        _client = InferenceClient(token=HUGGINGFACE_API_KEY or None)
    return _client


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

    client = _get_client()
    import asyncio
    import numpy as np

    results = []

    for text in texts:
        embedding = await asyncio.to_thread(
            client.feature_extraction, text, model=MODEL
        )
        arr = np.array(embedding)
        if arr.ndim == 1:
            results.append(arr.tolist())
        else:
            results.append(arr[0].tolist())

    return results


async def get_query_embedding(text: str) -> list[float]:
    results = await get_embeddings([text])
    return results[0]
