import os
import json
import httpx
import re
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL_ID = "deepseek/deepseek-chat-v3-0324:free"

headers = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "HTTP-Referer": "https://yourdomain.com",  # optional but recommended
    "X-Title": "Resume Analyzer",
    "Content-Type": "application/json"
}

async def analyze_resume_text(text: str):
    prompt = f"""
You are a professional technical recruiter AI. Your response *must be* a valid JSON object with no additional text before or after it. Use the following structure exactly:

{{
    "skills": [list of technical and soft skills extracted from the resume],
    "summary": "short professional summary",
    "suggestions": [list of tips to improve the resume],
    "job_fit_score": number between 0 and 100
}}

Resume:
{text}
"""

    body = {
        "model": MODEL_ID,
        "messages": [
            {"role": "system", "content": "You are an expert recruiter AI. Respond only with a valid JSON object matching the exact structure provided."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body)
            response.raise_for_status()
            result = response.json()

            # Extract and clean the model's response
            text_response = result["choices"][0]["message"]["content"].strip()
            print(f"Raw AI response: {text_response}")  # Debug output

            # Remove ```json markers if present
            cleaned_response = re.sub(r'^```json\s*|\s*```$', '', text_response, flags=re.MULTILINE)
            analysis = json.loads(cleaned_response)

            return analysis
    except httpx.HTTPStatusError as e:
        print(f"❌ HTTP Error: {e.response.status_code} - {e.response.text}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ JSON Parsing Error: {e}, Raw response: {text_response}")
        return None
    except Exception as e:
        print(f"❌ AI analysis error: {type(e).__name__} - {str(e)}")
        return None