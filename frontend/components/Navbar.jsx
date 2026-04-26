'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Home } from 'lucide-react';

export default function Navbar({ isDark, toggleTheme }) {
  const router = useRouter();

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div
          onClick={() => router.push('/')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">FC</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">File Converter</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">PDF & Image Tools</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white"
          >
            <Home className="w-5 h-5" />
            Home
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
