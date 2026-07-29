import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiClock, FiTrash2, FiChevronRight, FiFileText } from 'react-icons/fi';

export const HistorySidebar = ({ isOpen, onClose, history, onLoadSession, onDeleteSession }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
          />

          {/* Sidebar Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-205 dark:border-slate-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-2">
                <FiClock className="text-brand-500 w-5 h-5" />
                <h2 className="font-bold text-slate-850 dark:text-slate-100">Study History</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-550 dark:text-slate-400 transition-colors"
                aria-label="Close History"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {history.length === 0 ? (
                <div className="text-center py-16 text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
                  <FiFileText className="w-10 h-10 stroke-1" />
                  <p className="text-sm">No recent study sessions saved.</p>
                  <p className="text-xs">Generated decks will show up here.</p>
                </div>
              ) : (
                history.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onLoadSession(session)}
                    className="group border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 hover:bg-slate-50 dark:hover:bg-slate-950/45 hover:border-brand-500/25 transition-all duration-350 cursor-pointer relative overflow-hidden flex items-center justify-between"
                  >
                    <div className="pr-6 flex-1 min-w-0">
                      {/* Note summary snippet */}
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-250 truncate mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-450 transition-colors">
                        {session.notes}
                      </p>
                      {/* Timestamp & count */}
                      <div className="flex items-center gap-2 text-xxs text-slate-400 dark:text-slate-500">
                        <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{session.data.flashcards.length} cards</span>
                        <span>•</span>
                        <span>{session.data.quiz?.length || 0} MCQs</span>
                      </div>
                    </div>

                    {/* Hover actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => onDeleteSession(session.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                        title="Delete Session"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                      <FiChevronRight className="text-slate-400 group-hover:translate-x-0.5 transition-transform w-4 h-4" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer details */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center text-xxs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/20">
              Sessions are cached locally on your device.
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
export default HistorySidebar;
