import React from 'react';

export const SkeletonCard = ({ type = 'flashcard' }) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      {type === 'flashcard' ? (
        <div className="flex flex-col items-center">
          {/* Top filter placeholder */}
          <div className="w-full flex justify-between items-center mb-6">
            <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
          </div>
          
          {/* Main Flashcard Box Placeholder */}
          <div className="w-full h-80 glass-panel rounded-3xl p-8 flex flex-col justify-between items-center border border-slate-200/40 dark:border-slate-800/40 animate-soft-pulse mb-8">
            <div className="w-full flex justify-between">
              <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
            
            {/* Core Question text line mockups */}
            <div className="flex flex-col items-center gap-3 w-4/5">
              <div className="w-full h-5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              <div className="w-3/4 h-5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
            
            {/* Click to flip instructions */}
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            <div className="w-24 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-8 border border-slate-200/40 dark:border-slate-800/40 animate-soft-pulse">
          {/* Header Progress mock */}
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>
          
          {/* Question placeholder */}
          <div className="flex flex-col gap-3 mb-8 w-11/12">
            <div className="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div className="h-6 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          </div>

          {/* MCQ Option rows mock */}
          <div className="space-y-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            ))}
          </div>

          {/* Footer buttons mock */}
          <div className="flex justify-end">
            <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SkeletonCard;
