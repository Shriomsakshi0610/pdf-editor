'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ isDark, onChange }) {
  return (
    <button
      onClick={onChange}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
