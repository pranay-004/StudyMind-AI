# StudyMind AI - Modern AI Study Assistant

An elegant, interactive web application that converts raw study notes, definitions, or textbook content into beautifully structured interactive study decks (Flashcards and practice Quizzes) powered by **Groq API** (`llama-3.1-8b-instant`).

Designed as a modern visual web application, StudyMind AI uses structured JSON output parsed directly from the LLM to generate rich, interactive stateful components.

---

## ⚡ Features

### Interactive Flashcards
- **3D Card Flipping**: Built using CSS transform perspective and Framer Motion.
- **Controls & Progress**: Auto-shuffle, text filtering, deck restart, and keyboard shortcuts (`Space` to flip, `Arrow Keys` to navigate).

### Practice Quizzes
- **MCQ Questions**: 4-option practice tests with instant feedback highlighting correct/incorrect choices.
- **Review Panel & Retries**: Compare your answers with correct ones and re-test yourself on incorrect questions.

### Session History & Exporters
- **Session Cache**: Side panel saving up to 10 past sessions in `localStorage` for instant reloading.
- **Exporters**: Download study sheets as formatted CSV, Markdown, or text study guides.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + Groq API (querying `llama-3.1-8b-instant` with structured JSON output and Pydantic schema validation)

---

## 🚀 Setup & Execution

### 1. Backend Setup
1. Navigate to the `backend/` directory.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend/` directory and configure your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=8000
   HOST=127.0.0.1
   ```
4. Start the backend server:
   ```bash
   python main.py
   ```

### 2. Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app locally at `http://localhost:5173/`.
