from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, analyze, auth, resume_history, match
from app.routes import analytics


app = FastAPI(
    title="AI Resume Analyzer",
    description="Analyzes resumes using AI and returns skills, summary, and suggestions.",
    version="1.0.0"
)

# Allow CORS (Important for frontend to talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(auth.router)
app.include_router(resume_history.router)
app.include_router(match.router)
app.include_router(analytics.router)



@app.get("/")
def root():
    return {"message": "AI Resume Analyzer Backend is running 🚀"}