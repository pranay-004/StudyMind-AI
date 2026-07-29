import { useState, useEffect, useRef } from 'react';
import { generateStudyMaterial } from '../services/api';
import { getHistory, saveSession, deleteSession } from '../utils/helpers';
import confetti from 'canvas-confetti';

export const useStudyAssistant = () => {
  // Input State
  const [notes, setNotes] = useState('');
  
  // UI states
  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'quiz'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'; // Default to dark mode for modern visual feel
  });
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Flashcards state
  const [flashcards, setFlashcards] = useState([]);
  const [originalFlashcards, setOriginalFlashcards] = useState([]); // Keep backup for resets
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardSearchQuery, setCardSearchQuery] = useState('');

  // Quiz state
  const [quiz, setQuiz] = useState([]);
  const [originalQuiz, setOriginalQuiz] = useState([]); // Keep backup for full resets
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIndex: chosenOptionText }
  const [submittedAnswers, setSubmittedAnswers] = useState({}); // { questionIndex: boolean_isSubmitted }
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isRetryMode, setIsRetryMode] = useState(false);

  // AbortController reference to cancel previous requests
  const abortControllerRef = useRef(null);

  // Load history & theme on mount
  useEffect(() => {
    setHistory(getHistory());
    
    // Apply theme
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Dark Mode toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  // Notes management
  const handleClearNotes = () => setNotes('');
  const handleSetExampleNotes = () => {
    setNotes(
      "Python lists are mutable sequences. You can add, remove, and modify elements after creation.\n\n" +
      "Tuples are immutable sequences. Once created, their elements cannot be changed, which makes them faster and safer for fixed data.\n\n" +
      "Dictionaries store data as key-value pairs. Keys must be unique and immutable (like strings or tuples), while values can be any type."
    );
  };

  /**
   * Action to initiate study material generation
   */
  const handleGenerate = async (notesToSubmit) => {
    const promptText = notesToSubmit || notes;
    if (!promptText.trim()) {
      setError("Please paste some notes or specify a study topic first.");
      return;
    }

    // 1. Cancel previous pending request using AbortController
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 2. Initialize a new controller for the current request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 3. Reset states for new load
    setLoading(true);
    setError(null);
    setFlashcards([]);
    setOriginalFlashcards([]);
    setQuiz([]);
    setOriginalQuiz([]);
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setQuizScore(0);
    setQuizFinished(false);
    setIsRetryMode(false);

    try {
      const result = await generateStudyMaterial(promptText, controller.signal);
      
      // If request was aborted/canceled, api.js returns { canceled: true }
      if (result && result.canceled) {
        return;
      }

      if (!result.flashcards || result.flashcards.length === 0) {
        throw new Error("No study material generated. The AI returned empty flashcards.");
      }

      // Populate States
      setFlashcards(result.flashcards);
      setOriginalFlashcards(result.flashcards);
      setQuiz(result.quiz || []);
      setOriginalQuiz(result.quiz || []);
      
      // Save to localStorage history
      const updatedHistory = saveSession(promptText, result);
      setHistory(updatedHistory);
      
    } catch (err) {
      // Don't show error if request was aborted
      if (err.name === 'CanceledError' || err.originalError?.name === 'CanceledError') {
        return;
      }
      
      console.error("Study assistant error:", err);
      
      let errorMsg = "Failed to connect to the backend server. Please verify the backend is running.";
      if (err.isTimeout) {
        errorMsg = "The request timed out. The AI model is taking too long. Please try again with shorter text.";
      } else if (err.isNetworkError) {
        errorMsg = "A network error occurred. Please check your internet connection or check if backend is offline.";
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
    } finally {
      // Only clear loading state if this is still the active controller
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  // Reload an old session from history
  const handleLoadSession = (session) => {
    if (!session || !session.data) return;
    
    // Clear status
    setError(null);
    setLoading(false);
    
    // Populate session values
    setNotes(session.fullNotes || session.notes);
    setFlashcards(session.data.flashcards);
    setOriginalFlashcards(session.data.flashcards);
    setQuiz(session.data.quiz || []);
    setOriginalQuiz(session.data.quiz || []);
    
    // Reset indices/progress
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setQuizScore(0);
    setQuizFinished(false);
    setIsRetryMode(false);
    setIsSidebarOpen(false);
  };

  // Delete from history
  const handleDeleteSession = (id, e) => {
    e.stopPropagation(); // Avoid loading the session when deleting it
    const updated = deleteSession(id);
    setHistory(updated);
  };

  // Flashcards navigation
  const nextCard = () => {
    setIsCardFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % filteredFlashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsCardFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length);
    }, 150);
  };

  const flipCard = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  const shuffleCards = () => {
    setIsCardFlipped(false);
    setTimeout(() => {
      const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
      setFlashcards(shuffled);
      setCurrentCardIndex(0);
    }, 150);
  };

  const restartCards = () => {
    setIsCardFlipped(false);
    setTimeout(() => {
      setFlashcards([...originalFlashcards]);
      setCurrentCardIndex(0);
    }, 150);
  };

  // Search/Filter Flashcards
  const filteredFlashcards = flashcards.filter(card => 
    card.question.toLowerCase().includes(cardSearchQuery.toLowerCase()) ||
    card.answer.toLowerCase().includes(cardSearchQuery.toLowerCase())
  );

  // Quiz interactive elements
  const selectOption = (questionIdx, optionText) => {
    // If answer is already submitted for instant feedback, lock the input
    if (submittedAnswers[questionIdx]) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIdx]: optionText
    });
  };

  const submitQuestionAnswer = (questionIdx) => {
    if (!selectedAnswers[questionIdx]) return;
    
    const chosen = selectedAnswers[questionIdx];
    const correctAns = quiz[questionIdx].correct;
    const isCorrect = chosen === correctAns;
    
    setSubmittedAnswers({
      ...submittedAnswers,
      [questionIdx]: true
    });
    
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Completed last question
      setQuizFinished(true);
      
      // If perfect score, fire confetti!
      const totalScore = Object.keys(submittedAnswers).reduce((acc, idx) => {
        const questionIdx = parseInt(idx);
        const correct = quiz[questionIdx].correct;
        const chosen = selectedAnswers[questionIdx];
        return chosen === correct ? acc + 1 : acc;
      }, 0);
      
      if (totalScore === quiz.length && quiz.length > 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  /**
   * Filter and restart quiz with incorrect questions only
   */
  const startRetryIncorrect = () => {
    const incorrectQuestions = originalQuiz.filter((item, idx) => {
      const chosen = selectedAnswers[idx];
      return chosen !== item.correct;
    });

    if (incorrectQuestions.length === 0) return;

    setQuiz(incorrectQuestions);
    setIsRetryMode(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setQuizScore(0);
    setQuizFinished(false);
  };

  /**
   * Reset quiz back to full original set
   */
  const restartFullQuiz = () => {
    setQuiz(originalQuiz);
    setIsRetryMode(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setQuizScore(0);
    setQuizFinished(false);
  };

  // Keyboard shortcut handlers for Flashcards
  useEffect(() => {
    if (activeTab !== 'flashcards' || filteredFlashcards.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Stop page scrolling
        flipCard();
      } else if (e.code === 'ArrowRight') {
        nextCard();
      } else if (e.code === 'ArrowLeft') {
        prevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, currentCardIndex, filteredFlashcards.length, isCardFlipped]);

  return {
    notes,
    setNotes,
    activeTab,
    setActiveTab,
    loading,
    error,
    theme,
    toggleTheme,
    history,
    isSidebarOpen,
    setIsSidebarOpen,
    
    // Flashcard exports
    flashcards: filteredFlashcards,
    originalFlashcards,
    currentCardIndex,
    isCardFlipped,
    cardSearchQuery,
    setCardSearchQuery,
    nextCard,
    prevCard,
    flipCard,
    shuffleCards,
    restartCards,
    
    // Quiz exports
    quiz,
    originalQuiz,
    currentQuestionIndex,
    selectedAnswers,
    submittedAnswers,
    quizScore,
    quizFinished,
    isRetryMode,
    selectOption,
    submitQuestionAnswer,
    handleNextQuestion,
    startRetryIncorrect,
    restartFullQuiz,
    
    // Actions
    handleClearNotes,
    handleSetExampleNotes,
    handleGenerate,
    handleLoadSession,
    handleDeleteSession
  };
};
