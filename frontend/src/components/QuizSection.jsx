import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiCheckSquare, FiRefreshCw, FiArrowRight, FiAward, FiDownload } from 'react-icons/fi';
import { exportQuizTXT } from '../utils/helpers';

export const QuizSection = ({
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
  restartFullQuiz
}) => {
  const totalQuestions = quiz.length;
  const currentQuestion = quiz[currentQuestionIndex];
  const progressPercent = totalQuestions > 0 ? ((currentQuestionIndex + (submittedAnswers[currentQuestionIndex] ? 1 : 0)) / totalQuestions) * 100 : 0;

  // Render Quiz Summary / Completion view
  if (quizFinished) {
    const finalScore = Object.keys(submittedAnswers).reduce((acc, idx) => {
      const qIdx = parseInt(idx);
      if (!quiz[qIdx]) return acc;
      const isCorrect = selectedAnswers[qIdx] === quiz[qIdx].correct;
      return isCorrect ? acc + 1 : acc;
    }, 0);

    const percentScore = totalQuestions > 0 ? Math.round((finalScore / totalQuestions) * 100) : 0;
    const hasIncorrect = finalScore < totalQuestions;

    return (
      <div className="w-full max-w-2xl mx-auto py-4">
        <div className="glass-panel rounded-3xl p-8 border border-slate-205 dark:border-slate-800 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative design */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl animate-pulse"></div>
          
          <div className="inline-flex p-4 bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 rounded-full mb-6">
            <FiAward className="w-12 h-12" />
          </div>

          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Quiz Completed!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {isRetryMode ? "Retry mode results summary." : "Here is how you performed on this study set."}
          </p>

          {/* Score Box */}
          <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-850 max-w-xs mx-auto mb-8">
            <div className="text-4xl font-extrabold gradient-text mb-1">
              {finalScore} / {totalQuestions}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Score ({percentScore}%)
            </div>
          </div>

          {/* Review of all questions taken */}
          <div className="text-left space-y-5 mb-8 max-h-80 overflow-y-auto pr-2 no-scrollbar border-t border-slate-250/20 dark:border-slate-800/40 pt-6">
            <h4 className="font-bold text-sm text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Question Review</h4>
            {quiz.map((item, idx) => {
              const chosen = selectedAnswers[idx];
              const isCorrect = chosen === item.correct;
              
              return (
                <div key={idx} className={`p-4 rounded-xl border ${isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    {idx + 1}. {item.question}
                  </p>
                  <div className="text-xs space-y-1">
                    <p className={`flex items-center gap-1.5 ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-650 dark:text-red-400'}`}>
                      {isCorrect ? <FiCheck className="w-4 h-4 flex-shrink-0" /> : <FiX className="w-4 h-4 flex-shrink-0" />}
                      <span>Your Answer: <b>{chosen || "None selected"}</b></span>
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-600 dark:text-emerald-400 ml-5">
                        Correct Answer: <b>{item.correct}</b>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {hasIncorrect ? (
              <button
                onClick={startRetryIncorrect}
                className="btn-primary w-full sm:w-auto py-2.5 px-5 text-sm"
              >
                <FiRefreshCw className="w-4 h-4" />
                Retry Incorrect Questions
              </button>
            ) : (
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 py-2.5">
                🎉 Perfect Score! Outstanding work!
              </div>
            )}
            
            <button
              onClick={restartFullQuiz}
              className="btn-secondary w-full sm:w-auto py-2.5 px-5 text-sm"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reset Full Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active quiz display state
  const selectedOption = selectedAnswers[currentQuestionIndex];
  const isSubmitted = submittedAnswers[currentQuestionIndex];
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      {/* Header Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1">
          <FiCheckSquare />
          <span>{isRetryMode ? "Quiz (Retry Mode)" : "Quiz Practice"}</span>
        </div>

        <button
          onClick={() => exportQuizTXT(originalQuiz)}
          className="btn-secondary py-1.5 px-2.5 text-[11px] rounded-lg"
          title="Export Quiz to TXT study guide"
        >
          <FiDownload className="w-3.5 h-3.5" />
          Export Quiz
        </button>
      </div>

      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-205 dark:border-slate-800 shadow-xl relative">
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>Score: {quizScore}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6 md:mb-8">
          <motion.div
            className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Question Text */}
        <h3 className="text-lg md:text-xl font-bold text-slate-850 dark:text-slate-100 mb-6 md:mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* MCQs Option Rows */}
        <div className="space-y-3 mb-6 md:mb-8">
          {currentQuestion.options.map((option, idx) => {
            const label = labels[idx];
            const isSelected = selectedOption === option;
            const isCorrectAnswer = option === currentQuestion.correct;
            
            // Background & Border classes depending on submission status
            let cardStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900';
            let optionBadgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400';
            
            if (isSelected) {
              cardStyle = 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/20';
              optionBadgeStyle = 'bg-brand-500 text-white';
            }
            
            // Show correctness styles instantly after submission
            if (isSubmitted) {
              if (isCorrectAnswer) {
                // Correct answer always glows green
                cardStyle = 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450';
                optionBadgeStyle = 'bg-emerald-500 text-white';
              } else if (isSelected) {
                // Wrong answer selected glows red
                cardStyle = 'border-red-500 bg-red-50/40 dark:bg-red-950/20 text-red-800 dark:text-red-450';
                optionBadgeStyle = 'bg-red-500 text-white';
              } else {
                cardStyle = 'border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => selectOption(currentQuestionIndex, option)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 relative overflow-hidden group ${cardStyle}`}
              >
                {/* Option letter badge */}
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${optionBadgeStyle}`}>
                  {label}
                </span>
                
                {/* Option text */}
                <span className="font-semibold text-sm md:text-base flex-1 pr-6 text-slate-750 dark:text-slate-200">
                  {option}
                </span>

                {/* Instant Feedback indicator Icons */}
                {isSubmitted && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isCorrectAnswer ? (
                      <FiCheck className="w-5 h-5 text-emerald-500" />
                    ) : isSelected ? (
                      <FiX className="w-5 h-5 text-red-505 text-red-500" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer controls: Submit or Next */}
        <div className="flex justify-end items-center gap-3">
          {!isSubmitted ? (
            <button
              onClick={() => submitQuestionAnswer(currentQuestionIndex)}
              disabled={!selectedOption}
              className="btn-primary py-2.5 px-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="btn-primary py-2.5 px-6 text-sm"
            >
              <span>{currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}</span>
              <FiArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default QuizSection;
