import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`flex items-center bg-slate-100 dark:bg-[#101625] p-1 rounded-lg border border-slate-200 dark:border-indigo-500/25 transition-colors ${className}`}
      role="group"
      aria-label="Theme selector"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${
          theme === 'light'
            ? 'bg-white text-amber-600 font-bold shadow-sm border border-slate-200'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold'
        }`}
        title="Light Theme"
        aria-pressed={theme === 'light'}
      >
        <Sun className="h-3.5 w-3.5 text-amber-500" />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${
          theme === 'dark'
            ? 'bg-indigo-600 text-white font-bold shadow-sm border border-indigo-400/30'
            : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold'
        }`}
        title="Dark Theme"
        aria-pressed={theme === 'dark'}
      >
        <Moon className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-indigo-200' : 'text-slate-500'}`} />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}
