import React, { useState } from 'react';
import { FiBookOpen, FiTrash2, FiFileText, FiCpu, FiAlertCircle } from 'react-icons/fi';

const MAX_CHARACTERS = 5000;

export const StudyForm = ({ notes, setNotes, onGenerate, onClear, onSetExample, loading }) => {
  const [validationError, setValidationError] = useState('');
  
  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARACTERS) {
      setNotes(text);
      if (text.trim()) {
        setValidationError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!notes.trim()) {
      setValidationError('Please enter some notes or content to generate study material.');
      return;
    }
    setValidationError('');
    onGenerate();
  };

  const characterCount = notes.length;
  const isCloseToLimit = characterCount > MAX_CHARACTERS * 0.9;

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-200/40 dark:border-slate-800/40 shadow-xl relative">
        {/* Glow decoration */}
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
        
        {/* Header Label */}
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="notes" className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FiFileText className="text-brand-500 w-4 h-4" />
            Paste Notes or Topic Details
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSetExample}
              disabled={loading}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Populate template study notes"
            >
              Try Example
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={loading || !notes}
              className="text-xs font-semibold px-2 py-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              title="Clear input"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Textarea container */}
        <div className="relative mb-3">
          <textarea
            id="notes"
            rows="6"
            className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 md:p-5 text-slate-850 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300 resize-none text-sm md:text-base leading-relaxed"
            placeholder="E.g., Paste textbook definitions, coding guides, mutable vs immutable rules, biology terms, history logs, etc. to generate flashcards and a quiz (Max 5,000 characters)..."
            value={notes}
            onChange={handleTextChange}
            disabled={loading}
          />
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-550/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center gap-2 text-xs md:text-sm">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Footer controls: Counter & Generate */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Character counter */}
          <div className="text-xs text-slate-400 dark:text-slate-500">
            <span className={`font-semibold ${isCloseToLimit ? 'text-amber-500' : ''}`}>
              {characterCount.toLocaleString()}
            </span>{' '}
            / {MAX_CHARACTERS.toLocaleString()} characters
          </div>

          {/* Submit/Generate button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full sm:w-auto px-8 py-3 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer group"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <FiCpu className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform duration-305" />
                Generate Study Material
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default StudyForm;
