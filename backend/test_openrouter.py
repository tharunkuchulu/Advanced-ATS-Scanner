import os
import httpx
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")
headers = {
    "Authorization": f"Bearer {api_key}",
    "HTTP-Referer": "https://yourdomain.com",
    "X-Title": "Resume Analyzer",
    "Content-Type": "application/json"
}

body = {
    "model": "deepseek/deepseek-chat-v3-0324:free",
    "messages": [
        {"role": "user", "content": "Hello!"},
    ]
}

async def test():
    async with httpx.AsyncClient() as client:
        res = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body)
        print("Status:", res.status_code)
        print("Response:", res.text)

import asyncio
asyncio.run(test())
