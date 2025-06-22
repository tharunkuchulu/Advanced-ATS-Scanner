import os
import json
import httpx
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Fetch OpenRouter API Key from .env
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL_ID = "deepseek/deepseek-chat-v3-0324:free"

# ✅ Debug check for API key
if not OPENROUTER_API_KEY:
    raise EnvironmentError("❌ OPENROUTER_API_KEY is not set in .env or not loaded properly.")
else:
    print("✅ OpenRouter key loaded:", OPENROUTER_API_KEY[:8], "********")

# ✅ Headers without Bearer prefix
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
            {
                "role": "system",
                "content": "You are an expert recruiter AI. Respond only with a valid JSON object matching the exact structure provided."
            },
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
            print(f"🔎 Raw AI response: {text_response}")

            # Remove ```json markers if present
            cleaned_response = re.sub(r'^```json\s*|\s*```$', '', text_response, flags=re.MULTILINE)
            analysis = json.loads(cleaned_response)

            print("✅ Parsed AI JSON:", analysis)
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

async def match_resume_with_job(resume_text: str, job_description: str):
    prompt = f"""
You are a recruiter AI. Compare the candidate's resume with the job description.
Respond ONLY in the following JSON structure:

{{
  "match_score": number between 0 and 100,
  "missing_skills": [list of key missing skills],
  "fit_summary": "brief summary of how well the resume fits the job"
}}

Resume:
{resume_text}

Job Description:
{job_description}
"""

    body = {
        "model": MODEL_ID,
        "messages": [
            {"role": "system", "content": "You are a job matching AI. Respond with a clean JSON only."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body)
            response.raise_for_status()
            result = response.json()

            text_response = result["choices"][0]["message"]["content"].strip()
            print("🔍 Raw job match response:", text_response)

            cleaned = re.sub(r'^```json\s*|\s*```$', '', text_response, flags=re.MULTILINE)
            return json.loads(cleaned)

    except Exception as e:
        print(f"❌ Job match error: {type(e).__name__} - {str(e)}")
        return None
