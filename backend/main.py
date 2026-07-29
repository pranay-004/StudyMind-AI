import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import study
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="AI Study Assistant API",
    description="Backend API for generating flashcards and quiz questions from text notes using Gemini.",
    version="1.0.0"
)

# CORS Setup
# In production, specify front-end domains, but for local/demo/Vercel we can allow all origins or configurable ones
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*"  # Fallback wildcard for deployment on Render/Vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(study.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "AI Study Assistant Backend is running.",
        "docs": "/docs"
    }

if __name__ == "__main__":
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
