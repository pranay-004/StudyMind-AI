import React, { useState } from 'react';
import { useStudyAssistant } from './hooks/useStudyAssistant';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StudyForm from './components/StudyForm';
import FlashcardSection from './components/FlashcardSection';
import QuizSection from './components/QuizSection';
import Loader from './components/Loader';
import SkeletonCard from './components/SkeletonCard';
import ErrorMessage from './components/ErrorMessage';
import HistorySidebar from './components/HistorySidebar';
import { FiLayers, FiCheckSquare, FiX, FiAward, FiBookOpen } from 'react-icons/fi';
import { LuKeyboard } from 'react-icons/lu';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const {
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
    
    // Flashcards
    flashcards,
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
    
    // Quiz
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
  } = useStudyAssistant();

  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const hasGeneratedMaterial = flashcards.length > 0 || quiz.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 relative">
      {/* Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        historyCount={history.length}
        onToggleHistory={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <Hero />

        {/* Study Note Paste Form */}
        <StudyForm
          notes={notes}
          setNotes={setNotes}
          onGenerate={() => handleGenerate()}
          onClear={handleClearNotes}
          onSetExample={handleSetExampleNotes}
          loading={loading}
        />

        {/* Dynamic Display Area */}
        <div className="relative min-h-[300px]">
          {loading && (
            <div className="space-y-8">
              <Loader />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <SkeletonCard type="flashcard" />
                <SkeletonCard type="quiz" />
              </div>
            </div>
          )}

          {error && !loading && (
            <ErrorMessage
              message={error}
              onRetry={() => handleGenerate()}
            />
          )}

          {/* Render parsed flashcards and quiz */}
          {hasGeneratedMaterial && !loading && !error && (
            <div className="w-full max-w-4xl mx-auto mt-6">
              {/* Tab Selector Buttons */}
              <div className="flex border-b border-slate-205 dark:border-slate-800 mb-8 max-w-sm mx-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'flashcards'
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/50 dark:border-slate-750'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <FiLayers />
                  <span>Flashcards</span>
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'quiz'
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/50 dark:border-slate-750'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <FiCheckSquare />
                  <span>Practice Quiz</span>
                </button>
              </div>

              {/* Tab Content panels with slide transition animations */}
              <AnimatePresence mode="wait">
                {activeTab === 'flashcards' ? (
                  <motion.div
                    key="flashcards"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FlashcardSection
                      flashcards={flashcards}
                      originalFlashcards={originalFlashcards}
                      currentCardIndex={currentCardIndex}
                      isCardFlipped={isCardFlipped}
                      cardSearchQuery={cardSearchQuery}
                      setCardSearchQuery={setCardSearchQuery}
                      nextCard={nextCard}
                      prevCard={prevCard}
                      flipCard={flipCard}
                      shuffleCards={shuffleCards}
                      restartCards={restartCards}
                      notes={notes}
                      originalQuiz={originalQuiz}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <QuizSection
                      quiz={quiz}
                      originalQuiz={originalQuiz}
                      currentQuestionIndex={currentQuestionIndex}
                      selectedAnswers={selectedAnswers}
                      submittedAnswers={submittedAnswers}
                      quizScore={quizScore}
                      quizFinished={quizFinished}
                      isRetryMode={isRetryMode}
                      selectOption={selectOption}
                      submitQuestionAnswer={submitQuestionAnswer}
                      handleNextQuestion={handleNextQuestion}
                      startRetryIncorrect={startRetryIncorrect}
                      restartFullQuiz={restartFullQuiz}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Empty Prompt Banner */}
          {!hasGeneratedMaterial && !loading && !error && (
            <div className="max-w-md mx-auto text-center py-16 px-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 mb-4 animate-float">
                <FiBookOpen className="w-6.5 h-6.5 stroke-1" />
              </div>
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your study desk is empty
              </h3>
              <p className="text-xs md:text-sm text-slate-450 dark:text-slate-500">
                Paste your notes or select the "Try Example" button to populate notes and generate interactive flashcards & quizzes.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Sidebar Drawer history cache */}
      <HistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={history}
        onLoadSession={handleLoadSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {isShortcutsModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShortcutsModalOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-50"
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-150 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <LuKeyboard className="text-brand-500" />
                  Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setIsShortcutsModalOpen(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  When browsing the Flashcard Deck, you can use these shortcuts directly on your keyboard:
                </p>
                
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-850">
                  <span className="text-slate-650 dark:text-slate-350">Flip Active Card</span>
                  <kbd className="px-2.5 py-1 bg-slate-105 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-xs shadow-sm">
                    Spacebar
                  </kbd>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-850">
                  <span className="text-slate-650 dark:text-slate-350">Next Flashcard</span>
                  <kbd className="px-2.5 py-1 bg-slate-105 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-xs shadow-sm">
                    Right Arrow
                  </kbd>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-650 dark:text-slate-350">Previous Flashcard</span>
                  <kbd className="px-2.5 py-1 bg-slate-105 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-xs shadow-sm">
                    Left Arrow
                  </kbd>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky Footer */}
      <footer className="py-6 border-t border-slate-205 dark:border-slate-850 text-center text-xs text-slate-400 dark:text-slate-500 mt-12 bg-white/40 dark:bg-slate-950/20">
        StudyMind AI Assistant • Made with Groq & React
      </footer>
    </div>
  );
}

export default App;
