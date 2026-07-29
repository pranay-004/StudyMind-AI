# StudyMind AI - Modern AI Study Assistant

An advanced AI-powered Study Assistant designed to transform raw study notes, definitions, or textbook content into beautifully structured interactive study decks (Flashcards and practice Quizzes). Built using **React (Vite) + Tailwind CSS + Framer Motion** on the frontend, and **FastAPI + Google Gemini API** on the backend.

Unlike simple chatbots, StudyMind AI is designed strictly as an interactive visual web application. The AI returns strictly structured JSON data, which is parsed by the client-side app to generate rich, interactive stateful components.

---

## 🚀 Features

### Frontend (User Experience & Design)
- **Premium SaaS Visuals**: Beautiful Glassmorphic layout, deep indigo/brand violet gradients, soft background animations, dark mode support.
- **Interactive Flashcards**:
  - 3D card flipping animations using CSS transform perspective and Framer Motion.
  - Controls: Next/Prev navigation, Auto-Shuffle deck, Flip toggle, Restart deck.
  - Progress bar showing percentage completed.
  - Interactive search and filter to find specific questions inside the generated cards.
  - Keyboard shortcuts support (`Space` to flip, `Left/Right Arrows` to navigate).
- **Practice Quizzes**:
  - Multiple Choice Questions (MCQ) with 4 options.
  - Instant check/feedback system highlighting correct/incorrect choices instantly.
  - Final score report card.
  - **Smart Review Panel**: Inspect every question with chosen vs correct answer comparisons.
  - **Retry Mode**: Re-test yourself on incorrect answers only, or restart the full quiz.
- **Session Cache (Study History)**:
  - Sidebar drawer caching up to 10 past generated study sessions inside `localStorage`.
  - Reload past notes and study materials instantly with a single click.
- **Study Guide Exporters**:
  - Export generated Flashcards as a standard CSV format.
  - Export Quizzes as formatted Text Study Guides.
  - Export the combined study sheet as a markdown guide.
- **Failure Tolerant Loading**:
  - Skeleton cards mimic deck layout to reduce layout shift during loading.
  - Interactive loading spinner displaying helpful learning tips dynamically.

### Backend (Security & Reliability)
- **Strict JSON Generation**: Employs Gemini's Pydantic `response_schema` API parameter to guarantee generated JSON conforms exactly to the database model schema.
- **Clean Failure Handlers**: Protects the client-side React app from crashes by handling API timeouts, offline servers, malformed JSON, and empty responses.
- **Stale Request Cancellation**: Uses frontend `AbortController` hooks to cancel stale overlapping API requests. If a user clicks "Generate" multiple times, previous pending requests are cleanly cancelled, preventing race conditions.

---

## 🛠️ Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │             StudyMind UI (React)             │
                               │                                              │
                               │  - Tabbed Flashcards (Framer Motion / Keyboard)
                               │  - Practice Quiz (Instant Check / Retry-Wrong)
                               │  - History Cache & Exporters (CSV, MD, TXT) │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      │ (HTTP POST JSON payload)
                                                      │ Axios client + AbortController
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │             FastAPI Backend API              │
                               │                                              │
                               │  - CORS Middleware & Request Validation      │
                               │  - Error Interceptors (Timeout, bad input)   │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      │ (google-generativeai SDK)
                                                      │ Strict response_schema
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │             Google Gemini API                │
                               │         (gemini-1.5-flash model)             │
                               └──────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
ai-study-assistant/
├── backend/
│   ├── main.py                # FastAPI app initialization, middleware, routes
│   ├── routes/
│   │   └── study.py           # /api/generate endpoint & input validation
│   ├── services/
│   │   └── gemini.py          # Gemini configuration & structured JSON Pydantic parsing
│   ├── requirements.txt       # Python backend dependencies
│   ├── .env.example           # Template env variables config
│   └── .env                   # Local env configuration (not committed)
├── frontend/
│   ├── package.json           # Frontend dependencies (Framer-Motion, Axios, React Icons, etc)
│   ├── tailwind.config.js     # Tailwind design system configuration
│   ├── postcss.config.js      # PostCSS setup
│   ├── vite.config.js         # Vite configuration
│   ├── index.html             # HTML entry point (SEO metadata + Inter Google Font)
│   └── src/
│       ├── main.jsx           # App render entrypoint
│       ├── index.css          # Styling layers, custom scrollbars, perspective classes
│       ├── App.jsx            # Layout driver & tab states
│       ├── components/        # Reusable presentation components
│       │   ├── Navbar.jsx
│       │   ├── Hero.jsx
│       │   ├── StudyForm.jsx
│       │   ├── FlashcardSection.jsx
│       │   ├── QuizSection.jsx
│       │   ├── HistorySidebar.jsx
│       │   ├── Loader.jsx
│       │   ├── SkeletonCard.jsx
│       │   └── ErrorMessage.jsx
│       ├── hooks/
│       │   └── useStudyAssistant.js  # Main application logic & state machine hook
│       ├── services/
│       │   └── api.js         # Axios HTTP Client with AbortController integration
│       └── utils/
│           └── helpers.js     # LocalStorage state management & export handlers
└── README.md
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- Python (v3.9 or higher, tested on Python 3.13)
- Google Gemini API Key (available on Google AI Studio)

### 1. Backend Setup
1. Open your terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows (PowerShell)**: `venv\Scripts\Activate.ps1`
   - **Windows (Command Prompt)**: `venv\Scripts\activate.bat`
   - **macOS/Linux**: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Create a `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```
6. Add your Gemini API Key in the `.env` file:
   ```env
   GEMINI_API_KEY=AIzaSy...your_gemini_api_key...
   ```
7. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend should now be running at [http://localhost:8000](http://localhost:8000).

### 2. Frontend Setup
1. Open another terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   The application should now be open at [http://localhost:5173](http://localhost:5173).

---

## 🌍 Deployment

### Frontend (Vercel)
The frontend can be built and deployed directly to Vercel:
1. Initialize a git repository and commit all files.
2. Link your repository to Vercel.
3. Configure the Build Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the Environment Variable:
   - `VITE_API_URL` = URL of your deployed backend (e.g., `https://study-assistant-backend.onrender.com`).

### Backend (Render)
To deploy the FastAPI server to Render:
1. Create a new Web Service on Render linked to your git repository.
2. Select **Python** runtime environment.
3. Configure settings:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT` (set directory to `backend`)
4. Add environment variables under "Environment" settings:
   - `GEMINI_API_KEY` = your actual Gemini API key.
   - `PORT` = `8000`

---

## 🤖 AI Usage Note
This project was constructed in collaboration with Google's **Antigravity AI IDE Coding Assistant**. AI was utilized to design the state machine transitions (for the quiz retries and card shuffle features), generate the 3D card-flip perspective styles, and set up the structured Pydantic model configurations for Gemini's structured output.

## ⚠️ Known Limitations
- **API Limits**: The Gemini API key rate limits apply for free tiers (15 RPM). High load may cause temporary 429 errors.
- **Large Inputs**: Submitting text files containing over 30,000 words may exceed context token limits or trigger API timeouts.
- **Deterministic Out**: Pydantic schema guarantees JSON structure compliance, but occasional creative variance may happen if prompt notes are extremely vague.

## ⏱️ Time Spent
- **Architecture Planning**: ~1 hour
- **Backend APIs & Gemini Config**: ~2 hours
- **Frontend Components & Framer Motion**: ~3.5 hours
- **Integration, Failure Testing & Polish**: ~1.5 hours
- **Total Time**: ~8 hours
