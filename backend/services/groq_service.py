import os
import json
import logging
from typing import List, Dict, Any
from pydantic import BaseModel, Field
import httpx

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic schemas for strict JSON generation
class Flashcard(BaseModel):
    question: str = Field(..., description="A clear, concise question about the key concept.")
    answer: str = Field(..., description="A clear, accurate answer to the question.")

class QuizItem(BaseModel):
    question: str = Field(..., description="The multiple choice quiz question.")
    options: List[str] = Field(..., description="Exactly 4 distinct possible answers.")
    correct: str = Field(..., description="The correct answer, which must exactly match one of the items in 'options'.")

class StudyMaterial(BaseModel):
    flashcards: List[Flashcard] = Field(..., description="List of flashcards covering the notes.")
    quiz: List[QuizItem] = Field(..., description="List of multiple choice quiz questions covering the notes.")

def generate_study_material(notes: str, api_key: str) -> Dict[str, Any]:
    """
    Sends the user's notes to Groq API and requests structured StudyMaterial JSON.
    Returns the parsed JSON dictionary.
    """
    if not api_key:
        logger.error("Groq API key is missing.")
        raise ValueError("Groq API Key is not configured. Please set GROQ_API_KEY in the backend .env file.")

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Format the schema description in the prompt so the model understands the schema it must output.
    schema_desc = """
The output must be a valid JSON object matching this schema:
{
  "flashcards": [
    {
      "question": "string (A clear, concise question about the key concept.)",
      "answer": "string (A clear, accurate answer to the question.)"
    }
  ],
  "quiz": [
    {
      "question": "string (The multiple choice quiz question.)",
      "options": [
        "string (Exactly 4 distinct possible answers.)"
      ],
      "correct": "string (The correct answer, which must exactly match one of the items in 'options'.)"
    }
  ]
}
"""

    prompt = f"""You are an expert AI Study Assistant.
Generate comprehensive study materials based on the notes or topic below.
Ensure the questions cover the core concepts, definitions, and details provided.

Requirements for Flashcards:
- Create conceptual cards.
- Keep questions clear and answers concise but informative.

Requirements for Quiz:
- Each question must have EXACTLY 4 options.
- The 'correct' field must match one of the options EXACTLY.
- The options should be plausible but only one correct.

Format the output strictly as a single JSON object.

Notes / Topic:
---
{notes}
---
"""

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "system",
                "content": f"You are a study assistant that outputs JSON only. {schema_desc}"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2
    }

    logger.info("Sending request to Groq API...")
    
    try:
        with httpx.Client(timeout=45.0) as client:
            response = client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            response_json = response.json()
        
        content = response_json["choices"][0]["message"]["content"]
        
        # Verify response text exists
        if not content:
            logger.error("Groq API returned an empty response.")
            raise ValueError("No study material generated. The AI returned an empty response.")
        
        # Parse the JSON response
        data = json.loads(content)
        
        # Validate structure via Pydantic
        validated_material = StudyMaterial(**data)
        
        # Additional safety check for quiz correct answers
        for idx, item in enumerate(validated_material.quiz):
            if item.correct not in item.options:
                logger.warning(f"Quiz question {idx} correct answer '{item.correct}' was not in options: {item.options}. Appending/fixing it.")
                if len(item.options) >= 4:
                    item.options[0] = item.correct
                else:
                    item.options.append(item.correct)
        
        return validated_material.model_dump()
        
    except httpx.HTTPStatusError as hse:
        logger.error(f"Groq API HTTP Error: {hse.response.status_code} - {hse.response.text}")
        raise ValueError(f"Groq API Error: {hse.response.text}")
    except json.JSONDecodeError as jde:
        logger.error(f"Failed to parse Groq output as JSON: {jde}")
        raise ValueError("The AI returned invalid or malformed data. Please try again.")
    except Exception as e:
        logger.error(f"Error during Groq generation: {str(e)}")
        raise e
