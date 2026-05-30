import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

/**
 * Theme Toggle Component
 * Allows users to switch between light and dark modes
 */
export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={clsx(
        'inline-flex items-center justify-center p-2 rounded-lg',
        'transition-all duration-200',
        'bg-surface-secondary hover:bg-surface-tertiary',
        'text-text-primary',
        'border border-border-light hover:border-border-medium',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slb-blue-500',
        className
      )}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={20} className="transition-transform duration-300" />
      ) : (
        <Sun size={20} className="transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
