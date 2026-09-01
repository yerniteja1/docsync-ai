import httpx
from app.config import OPENROUTER_API_KEY

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free" #free model

async def ask_document(document_content: str, question: str, history: list) -> str:
    system_prompt = f"""You are a helpful document assistant. 
The user has uploaded a document and wants to ask questions about it.
Answer only based on the document content provided below.
If the answer is not in the document, say so clearly.

IMPORTANT: Do NOT use markdown formatting (no **bold**, # headers, bullet points, code blocks, etc.). Return plain text only.

--- DOCUMENT START ---
{document_content[:6000]}
--- DOCUMENT END ---"""

    messages = [{"role": "system", "content": system_prompt}]

    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})

    messages.append({"role": "user", "content": question})

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": MODEL,
                "messages": messages,
            }
        )
        data = response.json()
        if response.status_code != 200:
            raise Exception(f"OpenRouter error: {data}")
        return data["choices"][0]["message"]["content"]