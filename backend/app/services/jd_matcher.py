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
    "HTTP-Referer": "https://yourdomain.com",
    "X-Title": "Resume JD Matcher",
    "Content-Type": "application/json"
}

async def match_resume_with_jd(resume_text: str, job_description: str):
    prompt = f"""
You are an expert recruiter AI. Compare the following resume with the job description and return a JSON with:
{{
    "fit_percentage": number between 0 to 100,
    "matching_skills": [list of overlapping skills or experiences],
    "missing_skills": [list of important but missing skills],
    "verdict": "short sentence whether the resume fits or not"
}}

Resume:
{resume_text}

Job Description:
{job_description}
"""

    body = {
        "model": MODEL_ID,
        "messages": [
            {"role": "system", "content": "You are a smart recruiter assistant. Always reply in pure JSON format."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body)
            response.raise_for_status()
            result = response.json()

            text_output = result["choices"][0]["message"]["content"].strip()
            print(f"🔍 Raw AI Response:\n{text_output}")

            # Strip ```json blocks
            cleaned = re.sub(r"^```json\s*|\s*```$", "", text_output, flags=re.MULTILINE)
            parsed = json.loads(cleaned)
            print("✅ Parsed JSON Match Result:", parsed)
            return parsed

    except httpx.HTTPStatusError as e:
        print(f"❌ HTTP Error: {e.response.status_code} - {e.response.text}")
        return None
    except json.JSONDecodeError as e:
        print(f"❌ JSON Decode Error: {e} | Raw: {text_output}")
        return None
    except Exception as e:
        print(f"❌ Match error: {type(e).__name__} - {str(e)}")
        return None