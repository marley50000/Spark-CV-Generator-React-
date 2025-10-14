import React, { FC } from 'react';

// Define theme colors
export const themes = {
  indigo: {
    '--primary': '#4f46e5',
    '--primary-hover': '#4338ca',
    '--primary-light': '#eef2ff',
    '--primary-ring': '#6366f1',
    '--primary-border': '#c7d2fe',
    '--primary-text-dark': '#3730a3',
  },
  sky: {
    '--primary': '#0ea5e9',
    '--primary-hover': '#0284c7',
    '--primary-light': '#f0f9ff',
    '--primary-ring': '#38bdf8',
    '--primary-border': '#bae6fd',
    '--primary-text-dark': '#0c4a6e',
  },
  rose: {
    '--primary': '#e11d48',
    '--primary-hover': '#be123c',
    '--primary-light': '#fff1f2',
    '--primary-ring': '#f43f5e',
    '--primary-border': '#fecdd3',
    '--primary-text-dark': '#9f1239',
  },
  emerald: {
    '--primary': '#10b981',
    '--primary-hover': '#059669',
    '--primary-light': '#ecfdf5',
    '--primary-ring': '#34d399',
    '--primary-border': '#a7f3d0',
    '--primary-text-dark': '#065f46',
  },
};

export type Theme = keyof typeof themes;

interface ThemeSwitcherProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  return (
    <div className="flex items-center gap-2">
      {Object.keys(themes).map((themeKey) => {
        const theme = themes[themeKey as Theme];
        const isActive = currentTheme === themeKey;
        return (
          <button
            key={themeKey}
            title={themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
            onClick={() => setTheme(themeKey as Theme)}
            className={`w-6 h-6 rounded-full focus:outline-none transition-transform duration-200 transform hover:scale-110 ${isActive ? 'ring-2 ring-offset-2 ring-[var(--primary)]' : 'ring-1 ring-slate-300'}`}
            style={{ backgroundColor: theme['--primary'] }}
          />
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
