# app/utils/llm_utils.py

import os
import json
import httpx
import re
from typing import Dict, Any, Optional
from dotenv import load_dotenv
import asyncio

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "deepseek/deepseek-chat-v3-0324:free")

HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json",
    "X-Title": "Resume Analyzer",
    "HTTP-Referer": "https://yourdomain.com"  # customize!
}

# --- Prompt templates (DRY) ---
PROMPT_TEMPLATES = {
    "resume_analysis": lambda resume_text: f"""
You are a professional technical recruiter AI. Your response *must be* a valid JSON object with no additional text before or after it. Use the following structure exactly:

{{
    "skills": [list of technical and soft skills extracted from the resume],
    "summary": "short professional summary",
    "suggestions": [list of tips to improve the resume],
    "job_fit_score": number between 0 and 100
}}

Resume:
{resume_text}
""",

    # --- UPDATED: Always ask for strengths and weaknesses for JD matching! ---
    "jd_matching": lambda resume_text, job_description: f"""
You are an expert recruiter AI. Compare the following resume with the job description and return a JSON with:
{{
    "fit_percentage": number between 0 to 100,
    "matching_skills": [list of overlapping skills or experiences],
    "missing_skills": [list of important but missing skills],
    "strengths": [list of resume strengths],
    "weaknesses": [list of resume weaknesses],
    "verdict": "short sentence whether the resume fits or not"
}}

Resume:
{resume_text}

Job Description:
{job_description}
""",

    "resume_improvement": lambda resume_text, job_description: f"""
You are an AI Career Coach helping a candidate improve their resume to match a given job description.

Job Description:
{job_description}

Candidate Resume:
{resume_text}

Analyze the resume and provide structured suggestions in the following JSON format:

{{
  "matching_skills": [...],
  "missing_skills": [...],
  "tools_to_learn": [...],
  "resources_to_explore": [...],
  "strengths": [...],
  "weaknesses": [...],
  "fit_summary": {{
    "technical_fit": "...",
    "upside": "...",
    "recommendation": "...",
    "alternative_roles": [...]
  }}
}}

Strictly return only the JSON. No explanation, no markdown, no commentary.
"""
}

# --- Core OpenRouter call ---
async def call_llm(
    prompt: str,
    system_prompt: str = "You are a helpful AI assistant. Respond only with a valid JSON.",
    retries: int = 3,
    timeout: int = 60
) -> Optional[Dict[str, Any]]:
    body = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    }

    for attempt in range(retries):
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=HEADERS,
                    json=body
                )
                response.raise_for_status()
                result = response.json()
                raw = result["choices"][0]["message"]["content"].strip()
                # Remove code fences if present
                cleaned = re.sub(r"^```json\s*|\s*```$", "", raw, flags=re.MULTILINE)
                return json.loads(cleaned)
        except (httpx.HTTPStatusError, httpx.TimeoutException) as e:
            if attempt < retries - 1:
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
            else:
                print(f"❌ LLM call failed after {retries} attempts: {e}")
                return None
        except json.JSONDecodeError as e:
            print(f"❌ LLM returned invalid JSON: {e}, raw: {raw}")
            return None
        except Exception as e:
            print(f"❌ Unexpected error: {type(e).__name__} - {str(e)}")
            return None

# --- Example usage in your endpoints: ---

# Resume analysis
async def analyze_resume_text(resume_text: str):
    prompt = PROMPT_TEMPLATES["resume_analysis"](resume_text)
    return await call_llm(prompt, system_prompt="You are an expert recruiter AI. Respond only with a valid JSON object matching the exact structure provided.")

# JD matching (includes strengths/weaknesses)
async def match_resume_with_jd(resume_text: str, jd_text: str):
    prompt = PROMPT_TEMPLATES["jd_matching"](resume_text, jd_text)
    return await call_llm(prompt, system_prompt="You are a smart recruiter assistant. Always reply in pure JSON format.")

# Resume improvement suggestions
async def suggest_resume_improvements(resume_text: str, jd_text: str):
    prompt = PROMPT_TEMPLATES["resume_improvement"](resume_text, jd_text)
    return await call_llm(prompt, system_prompt="You are an expert career coach. Respond only with a valid JSON structure.")
