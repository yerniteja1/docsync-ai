import json
import httpx
from app.config import OPENROUTER_API_KEY

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free"


async def stream_answer(context: str, question: str, history: list, sources: list):
    system_prompt = f"""You are a helpful document assistant.
Answer based on the document chunks provided below.
If the answer is not in the chunks, say so clearly.
Cite which chunk(s) you used by referencing [1], [2], etc.

IMPORTANT: Do NOT use markdown formatting. Return plain text only.

--- DOCUMENT CHUNKS ---
{context}
--- END CHUNKS ---"""

    messages = [{"role": "system", "content": system_prompt}]
    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": question})

    async with httpx.AsyncClient(timeout=60) as client:
        async with client.stream(
            "POST",
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": MODEL,
                "messages": messages,
                "stream": True,
            },
        ) as response:
            if response.status_code != 200:
                body = await response.aread()
                yield f"data: {json.dumps({'error': f'OpenRouter error: {body.decode()}'})}\n\n"
                return

            yield f"data: {json.dumps({'sources': sources})}\n\n"

            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]
                    if data == "[DONE]":
                        break
                    try:
                        chunk = json.loads(data)
                        delta = chunk.get("choices", [{}])[0].get("delta", {})
                        content = delta.get("content", "")
                        if content:
                            yield f"data: {json.dumps({'content': content})}\n\n"
                    except json.JSONDecodeError:
                        continue

            yield f"data: {json.dumps({'done': True})}\n\n"
