import React from 'react';
import { FiLayers, FiCheckSquare, FiZap } from 'react-icons/fi';

export const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden py-12 md:py-16 text-center">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-brand-500/20 dark:bg-brand-500/10 blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 blur-3xl animate-blob animation-delay-2000"></div>

      {/* Hero Content */}
      <div className="relative max-w-4xl mx-auto px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-slate-905 border border-slate-200/60 dark:border-slate-800 shadow-sm mb-6">
          <FiZap className="w-3.5 h-3.5 text-brand-500" />
          <span className="text-slate-600 dark:text-slate-350">Supercharge your learning</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5.5xl font-extrabold leading-tight tracking-tight mb-5">
          Transform Your Notes with <br />
          <span className="gradient-text">Interactive AI Study Decks</span>
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Paste your study text, raw notes, or textbook passages below. Our  assistant instantly parses them into structured flashcard sets and interactive multiple-choice quizzes.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 max-w-md mx-auto text-sm text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2 bg-white/40 dark:bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-200/30 dark:border-slate-800/30">
            <FiLayers className="text-brand-500" />
            <span>Interactive Flashcards</span>
          </div>
          <div className="flex items-center gap-2 bg-white/40 dark:bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-200/30 dark:border-slate-800/30">
            <FiCheckSquare className="text-indigo-500" />
            <span>Instant Quiz MCQs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
