from typing import Dict
from openai import AsyncOpenAI
import os
import json

client = AsyncOpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

async def match_resume_to_jd(resume_text: str, jd_text: str) -> Dict:
    resume_text = resume_text[:50000]
    jd_text = jd_text[:1000]

    prompt = f"""
You are an AI recruiting assistant. Based on the following resume and job description, evaluate the match and return:
1. A match score (out of 100)
2. Matching skills
3. Missing skills
4. Key strengths
5. Weaknesses
6. A short conclusion about fit for the role.

Resume:
{resume_text}

Job Description:
{jd_text}

Respond strictly in JSON with keys:
- match_score (int)
- matching_skills (list of strings)
- missing_skills (list of strings)
- strengths (list of strings)
- weaknesses (list of strings)
- fit_statement (string)
"""

    try:
        response = await client.chat.completions.create(
            model=os.getenv("OPENROUTER_MODEL"),
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )

        raw = response.choices[0].message.content.strip()
        print("🔍 RAW LLM RESPONSE:\n", raw)  # DEBUG

        # 🔧 Sanitize output by removing ```json and ```
        if raw.startswith("```json"):
            raw = raw[7:]
        elif raw.startswith("```"):
            raw = raw[3:]
        if raw.endswith("```"):
            raw = raw[:-3]

        return json.loads(raw)

    except Exception as e:
        print("❌ Failed to parse LLM response:", e)
        return {
            "match_score": 0,
            "matching_skills": [],
            "missing_skills": [],
            "strengths": [],
            "weaknesses": [],
            "fit_statement": f"Unable to evaluate fit: {str(e)}"
        }