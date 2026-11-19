import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-surface-light dark:hover:bg-surface-dark transition"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-zinc-200 hover:text-white" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 hover:text-black" />
      )}
    </button>
  );
};
