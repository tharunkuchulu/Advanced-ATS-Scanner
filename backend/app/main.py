from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, auth, resume_history, match
from app.routes import analytics
from app.routes import upload_jd
from app.routes import dashboard, recruit
from app.routes import jd_scraper
from app.routes import insights, improvements
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from fastapi import Request
from slowapi.errors import RateLimitExceeded

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
app.include_router(auth.router)
app.include_router(resume_history.router)
app.include_router(match.router)
app.include_router(analytics.router)
app.include_router(upload_jd.router)
app.include_router(jd_scraper.router)
app.include_router(dashboard.router)
app.include_router(recruit.router)
app.include_router(insights.router, tags=["Insights"])
app.include_router(improvements.router)


limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/")
def root():
    return {"message": "AI Resume Analyzer Backend is running 🚀"}