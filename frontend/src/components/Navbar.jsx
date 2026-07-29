import { FiBookOpen, FiMoon, FiSun, FiLayers } from 'react-icons/fi';
import { LuHistory, LuKeyboard } from 'react-icons/lu';

export const Navbar = ({ theme, toggleTheme, historyCount, onToggleHistory, onOpenShortcuts }) => {
  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-brand-650 to-indigo-650 text-white rounded-xl shadow-md shadow-brand-500/10">
              <FiBookOpen className="w-5.5 h-5.5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-300">
              StudyMind AI
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xxs font-medium bg-brand-500/15 text-brand-600 dark:text-brand-400">
              v1.0
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Keyboard Shortcuts Button */}
            <button
              onClick={onOpenShortcuts}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-250 transition-colors"
              title="Keyboard Shortcuts"
              aria-label="Keyboard Shortcuts"
            >
              <LuKeyboard className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-250 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* History Drawer Button */}
            <button
              onClick={onToggleHistory}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-250 transition-colors flex items-center gap-1.5"
              title="History"
              aria-label="Open History"
            >
              <LuHistory className="w-5 h-5" />
              {historyCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
