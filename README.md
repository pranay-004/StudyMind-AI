# AI Study Assistant

## 1. Project Overview
AI Study Assistant is a modern, interactive web application that converts raw study notes, concepts, or textbook descriptions into beautifully structured study materials. The app generates custom 3D interactive Flashcard decks and multiple-choice Quizzes to help students learn and review concepts efficiently. 

The application utilizes a FastAPI backend to process note content and generate strictly structured JSON responses via the Groq API, which the client-side React app parses into interactive, stateful study views.

---

## 2. Features
- **Interactive 3D Flashcards**: Flip cards dynamically using keyboard shortcuts (`Space` to flip, `Arrow Keys` to navigate) or click controls, with automated deck shuffling and text filtering.
- **Stateful Practice Quizzes**: Challenge yourself with 4-option multiple-choice quizzes that offer instant correct/incorrect feedback, an end-of-test score report, and a detailed answer review panel.
- **Retry Mode**: Re-test yourself on incorrect quiz answers to reinforce learning.
- **Session Cache & History**: Access a sidebar drawer caching up to 10 past generated study sessions locally in your browser.
- **Formatted Exporters**: Download study content as a CSV (for flashcards), Markdown (combined study sheet), or standard text file (quiz guides).
- **Loading UI Tips**: Display educational study tips dynamically while cards are being generated.

---

## 3. Tech Stack
- **Frontend**: React (Vite), Tailwind CSS (v4), Framer Motion (animations)
- **Backend**: FastAPI (Python), Uvicorn (ASGI server), HTTPX (async requests), Pydantic (data validation)
- **AI Model**: Groq API (`llama-3.1-8b-instant` model)

---

## 4. Project Structure
```text
ai-study-assistant/
├── backend/
│   ├── routes/
│   │   └── study.py           # API endpoints & validation
│   ├── services/
│   │   └── groq_service.py    # Groq API structured completion & validation
│   ├── .env                   # Local server settings & API key (git-ignored)
│   ├── .env.example           # Shared environment variables template
│   ├── main.py                # Server entrypoint & middleware setup
│   └── requirements.txt       # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── favicon.svg        # App browser icon
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom state hooks
│   │   ├── services/          # API communication client
│   │   ├── utils/             # Helper formatters
│   │   ├── App.jsx            # Layout driver & tab states
│   │   ├── index.css          # Design system stylesheet
│   │   └── main.jsx           # App render client mount
│   ├── index.html             # HTML entry point
│   ├── package.json           # Frontend package dependencies
│   └── tailwind.config.js     # Tailwind v3 fallback configuration
└── .gitignore                 # Excludes build, dependencies, and environment keys
```

---

## 5. Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+

### Clone Repository
```bash
git clone https://github.com/pranay-004/StudyMind-AI.git
cd StudyMind-AI
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=8000
   HOST=127.0.0.1
   ```
5. Start the server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Open a new terminal in the root directory and navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173/`.

---

## 6. AI Usage Note
AI tools were utilized during development for brainstorming, UI layout structuring, and code integration assistance. However, all critical logic implementation, theme customization, bug debugging, API migrations, and final functional verification were completed manually.

---

## 7. Known Limitations
- **API Rate Limits**: The application is subject to the RPM (Requests Per Minute) and TPM (Tokens Per Minute) limit guidelines of the Groq API free tier.
- **Input Character Limit**: Very long notes or copy-pasted document chapters may exceed the maximum context window of the prompt, resulting in generation truncation.
- **Cache Size**: The study history drawer saves sessions in `localStorage`, which is capped at 10 items to prevent browser storage exhaustion.
- **Offline Generation**: Although the local UI loads offline, generating new flashcards or quizzes requires an active internet connection to communicate with the Groq API.

---

## 8. Time Spent
Total estimated time spent on this project: **~7.5 hours**.

| Phase | Description | Time Spent |
| :--- | :--- | :--- |
| **Backend Setup & API** | FastAPI project initialization, Pydantic schemas, Groq API client validation | 2.0 Hours |
| **Frontend Foundation** | StudyForm layout, interactive 3D Flashcards with keyboard bindings | 2.5 Hours |
| **State & Caching** | LocalStorage integration, session history drawers, CSV/Markdown export helper utilities | 1.0 Hour |
| **UI Design & Dark Theme** | Transitioning styles to Midnight Obsidian background and custom Teal/Sky/Emerald theme | 1.0 Hour |
| **Testing & Cleanup** | API test runs, project housekeeping (unneeded assets deletion), Git configuration, and pushes | 1.0 Hour |

---

## 9. Screenshots

### Home Page
![Home Page Placeholder](./docs/screenshots/home.png)

### Flashcards Page
![Flashcards Page Placeholder](./docs/screenshots/flashcards.png)

### Quiz Page
![Quiz Page Placeholder](./docs/screenshots/quiz.png)

### Error State
![Error State Placeholder](./docs/screenshots/error.png)

---

## 10. Future Improvements
- **PDF/Text File Upload**: Enable users to upload `.pdf`, `.docx`, or `.txt` study materials directly instead of copy-pasting notes.
- **Voice Study Mode**: Implement Text-to-Speech (TTS) on flashcards to read questions and answers aloud.
- **Multiple Decks**: Support categorizing study materials into separate folders or topics.
- **User Authentication**: Migrate from local browser cache to an database-backed system allowing cross-device syncing.
