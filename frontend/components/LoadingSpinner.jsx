'use client';

import React from 'react';

export default function LoadingSpinner({ message = 'Processing...', progress = 0 }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center max-w-sm mx-4">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
          <div
            className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"
          ></div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{message}</h3>
        {progress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{Math.round(Math.min(progress, 100))}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
