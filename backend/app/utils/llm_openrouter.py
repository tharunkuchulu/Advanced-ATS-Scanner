import re
import json
import httpx
import os

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL")

async def call_openrouter_model(prompt: str):
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": os.getenv("OPENROUTER_MODEL"),  # e.g., deepseek-chat-v3-0324:free
        "messages": [
            {"role": "system", "content": "You are an expert career advisor and AI assistant."},
            {"role": "user", "content": prompt}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"OpenRouter error: {response.text}")

    try:
        content = response.json()
        return content["choices"][0]["message"]["content"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse OpenRouter response: {str(e)}")
