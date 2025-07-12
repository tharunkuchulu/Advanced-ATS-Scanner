# SkillSync AI

# 📄 SkillSync AI – Workflow Documentation

SkillSync AI is an AI-powered resume analysis platform that leverages LLMs and (optionally) RAG (Retrieval-Augmented Generation) using ChromaDB to help recruiters and candidates streamline hiring and profile matching.

---

## 🔐 1. Authentication & User Management
- **Frontend:** React (Vite) + MUI
- **Backend:** FastAPI with JWT
- **Workflow:**
  - User signs up/logs in
  - JWT token generated
  - Token used for authenticated requests

---

## 📤 2. Resume Upload & Parsing
- PDF resume uploaded by user
- Parsed text extracted and stored in MongoDB
- Each upload is auto-versioned (v1, v2, …)

---

## 🧠 3. Resume Analysis
- GPT-based resume and JD comparison
- Match score, skills match, and suggestions generated
- Optional RAG Flow:
  - Resume/JD embedded
  - Semantically similar resumes retrieved from ChromaDB
  - Injected into LLM for contextual generation

---

## 📄 4. Job Description Handling
- JD pasted manually or scraped from LinkedIn/Indeed
- Stored in MongoDB
- Used for match analysis and similarity search

---

## 📊 5. Recruiter Dashboard
- Resume filtering based on:
  - Skills
  - Match Score
  - Fit %
- Download as PDF/CSV
- View analysis and improvement suggestions

---

## 🧬 6. RAG (ChromaDB Integration)
- Resume/JD embedded via `sentence-transformers`
- Stored in ChromaDB
- Top-k similar resumes retrieved for LLM prompt context

---

## 📁 7. Resume Versioning
- New uploads = New versions (v1, v2, v3…)
- Recruiters can view resume history and improvements

---

## 📄 8. Export Features
- Generate PDFs and CSVs of analysis reports
- Includes scores, suggestions, and summaries

---

## 🔐 9. Security & Roles
- JWT-auth protected APIs
- Role support:
  - Candidates
  - Recruiters

---

## 🧠 10. LLM Integration
- **Model:** deepseek-chat-v3 via OpenRouter
- Used for:
  - Resume suggestions
  - JD-resume fit analysis
  - Context-aware RAG prompts