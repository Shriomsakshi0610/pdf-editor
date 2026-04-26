'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) return null;

  return (
    <html lang="en" className={isDark ? 'dark' : ''}>
      <body className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
