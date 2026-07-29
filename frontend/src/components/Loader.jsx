import React, { useState, useEffect } from 'react';
import { FiBookOpen } from 'react-icons/fi';

const STUDY_TIPS = [
  "Retrieval practice (testing yourself) is up to 3x more effective than re-reading notes.",
  "Spacing your study sessions over several days helps move information to long-term memory.",
  "Feynman Technique: Try explaining the concept to a 5-year-old to find gaps in your knowledge.",
  "Taking breaks (e.g. Pomodoro technique) keeps your brain fresh and increases focus.",
  "Our brain processes visual information much faster than text. Try to visualize flashcards!",
  "Sleep consolidation: Getting 8 hours of sleep after studying solidifies memory paths."
];

export const Loader = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % STUDY_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto">
      {/* Outer spinning ring with glowing core */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 border-r-indigo-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-brand-500 dark:text-brand-400">
          <FiBookOpen className="w-8 h-8 animate-pulse-slow" />
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100 animate-pulse">
        Generating Study Material...
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Groq is creating structured flashcards and quiz questions from your notes.
      </p>

      {/* Glassmorphic Study Tip Box */}
      <div className="glass-panel rounded-2xl p-5 border border-brand-500/20 max-w-md w-full relative overflow-hidden transition-all duration-500">
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-brand-500/10 rounded-full blur-xl"></div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
          Study Tip
        </span>
        <p className="text-sm text-slate-650 dark:text-slate-350 italic transition-opacity duration-300">
          "{STUDY_TIPS[tipIndex]}"
        </p>
      </div>
    </div>
  );
};
export default Loader;
