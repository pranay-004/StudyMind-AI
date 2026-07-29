import os
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from services.groq_service import generate_study_material
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/api",
    tags=["study"]
)

class GenerateRequest(BaseModel):
    notes: str = Field(..., description="The user's notes or study topic.")

class FlashcardSchema(BaseModel):
    question: str
    answer: str

class QuizItemSchema(BaseModel):
    question: str
    options: list[str]
    correct: str

class GenerateResponse(BaseModel):
    flashcards: list[FlashcardSchema]
    quiz: list[QuizItemSchema]

@router.post("/generate", response_model=GenerateResponse)
async def generate_material(payload: GenerateRequest):
    """
    Endpoint that processes notes and generates study material (flashcards & quiz).
    """
    notes = payload.notes.strip()
    
    if not notes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Study notes or topic content cannot be empty."
        )

    # Retrieve Groq API Key from environment
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GROQ_API_KEY is not configured on the backend server. Please configure it in your environment variables or backend/.env file."
        )

    try:
        # Call Gemini service
        result = generate_study_material(notes, api_key)
        return result
    except ValueError as ve:
        # Handle specific validation/JSON errors from our service
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except Exception as e:
        # Catch unexpected API errors
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Groq API Error: {str(e)}"
        )
