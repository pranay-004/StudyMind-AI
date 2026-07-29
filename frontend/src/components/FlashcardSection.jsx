import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiRepeat, FiShuffle, FiRotateCcw, FiDownload, FiSearch, FiHelpCircle } from 'react-icons/fi';
import { exportFlashcardsCSV, exportStudyGuideMarkdown } from '../utils/helpers';

export const FlashcardSection = ({
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
  notes,
  originalQuiz
}) => {
  const totalCards = flashcards.length;
  const currentCard = flashcards[currentCardIndex];
  const progressPercent = totalCards > 0 ? ((currentCardIndex + 1) / totalCards) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      {/* Search & Export Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-6">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <input
            type="text"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            placeholder="Search flashcards..."
            value={cardSearchQuery}
            onChange={(e) => setCardSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => exportFlashcardsCSV(originalFlashcards)}
            className="btn-secondary py-2 px-3 text-xs w-full sm:w-auto"
            title="Export deck to CSV"
          >
            <FiDownload className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => exportStudyGuideMarkdown(notes, originalFlashcards, originalQuiz)}
            className="btn-secondary py-2 px-3 text-xs w-full sm:w-auto"
            title="Export full Study Guide to Markdown"
          >
            <FiDownload className="w-3.5 h-3.5" />
            Study Guide (.md)
          </button>
        </div>
      </div>

      {totalCards === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
          <p className="text-slate-500 dark:text-slate-400">No cards matched your search terms.</p>
          <button
            onClick={() => setCardSearchQuery('')}
            className="text-brand-500 hover:text-brand-655 mt-2 text-sm font-semibold"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Progress Indicator */}
          <div className="w-full flex justify-between items-center mb-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <span>Card {currentCardIndex + 1} of {totalCards}</span>
            <span>{Math.round(progressPercent)}% studied</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
            <motion.div
              className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Flashcard container (3D Flip Effect) */}
          <div 
            onClick={flipCard}
            className="w-full h-80 perspective-1000 cursor-pointer select-none group focus:outline-none mb-8"
            tabIndex={0}
            aria-label={`Flashcard: ${isCardFlipped ? 'Answer face' : 'Question face'}. Press space to flip, left/right arrows to browse.`}
            onKeyDown={(e) => {
              if (e.code === 'Space') {
                e.preventDefault();
                flipCard();
              }
            }}
          >
            <div className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${isCardFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Question Face (Front) */}
              <div className="backface-hidden absolute inset-0 glass-panel rounded-3xl p-8 flex flex-col justify-between items-center border-slate-200 dark:border-slate-800 shadow-xl group-hover:border-brand-500/25 transition-colors">
                <div className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <span>Front</span>
                  <span className="bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-md">
                    Question
                  </span>
                </div>

                <div className="text-center font-bold text-lg md:text-xl text-slate-800 dark:text-slate-100 max-w-md px-2 overflow-y-auto leading-relaxed my-auto no-scrollbar">
                  {currentCard.question}
                </div>

                <div className="text-slate-400 dark:text-slate-500 text-xxs flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <FiRepeat />
                  <span>Click card or press Space to flip</span>
                </div>
              </div>

              {/* Answer Face (Back) */}
              <div className="backface-hidden rotate-y-180 absolute inset-0 bg-gradient-to-tr from-brand-650 to-indigo-650 text-white rounded-3xl p-8 flex flex-col justify-between items-center border border-brand-500/20 shadow-2xl shadow-brand-500/10">
                <div className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-brand-200">
                  <span>Back</span>
                  <span className="bg-white/15 px-2 py-0.5 rounded-md text-white">
                    Answer
                  </span>
                </div>

                <div className="text-center font-medium text-base md:text-lg text-white max-w-md px-2 overflow-y-auto leading-relaxed my-auto no-scrollbar">
                  {currentCard.answer}
                </div>

                <div className="text-brand-200 text-xxs flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <FiRepeat />
                  <span>Click card or press Space to flip</span>
                </div>
              </div>

            </div>
          </div>

          {/* Flashcard Action Toolbar */}
          <div className="flex items-center gap-3 md:gap-4 flex-wrap justify-center">
            {/* Shuffle */}
            <button
              onClick={shuffleCards}
              className="p-3 rounded-xl border border-slate-205 dark:border-slate-800 text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-sm"
              title="Shuffle Deck"
              aria-label="Shuffle Deck"
            >
              <FiShuffle className="w-5 h-5" />
            </button>

            {/* Prev */}
            <button
              onClick={prevCard}
              className="btn-secondary py-3 px-5"
              title="Previous card (Left Arrow)"
              aria-label="Previous card"
            >
              <FiChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Flip toggle button */}
            <button
              onClick={flipCard}
              className="btn-primary py-3 px-6"
              title="Flip card (Spacebar)"
              aria-label="Flip card"
            >
              <FiRepeat className="w-4.5 h-4.5 animate-pulse-slow" />
              <span>Flip</span>
            </button>

            {/* Next */}
            <button
              onClick={nextCard}
              className="btn-secondary py-3 px-5"
              title="Next card (Right Arrow)"
              aria-label="Next card"
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight className="w-5 h-5" />
            </button>

            {/* Restart */}
            <button
              onClick={restartCards}
              className="p-3 rounded-xl border border-slate-205 dark:border-slate-800 text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-sm"
              title="Reset Deck Order"
              aria-label="Reset Deck Order"
            >
              <FiRotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Keyboard shortcuts tooltip */}
          <div className="mt-8 flex items-center gap-2 text-xxs text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-900/30 px-3 py-1.5 rounded-full border border-slate-200/30 dark:border-slate-800/30">
            <FiHelpCircle />
            <span>Tip: Navigate using the <b>Left/Right arrows</b> and flip using the <b>Spacebar</b>.</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default FlashcardSection;
