'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ToolCard({ tool }) {
  const router = useRouter();
  const Icon = tool.icon;

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-600',
    green: 'from-green-500 to-green-600 text-green-600',
    purple: 'from-purple-500 to-purple-600 text-purple-600',
    orange: 'from-orange-500 to-orange-600 text-orange-600',
    red: 'from-red-500 to-red-600 text-red-600',
    pink: 'from-pink-500 to-pink-600 text-pink-600',
    cyan: 'from-cyan-500 to-cyan-600 text-cyan-600',
    indigo: 'from-indigo-500 to-indigo-600 text-indigo-600',
    yellow: 'from-yellow-500 to-yellow-600 text-yellow-600',
    teal: 'from-teal-500 to-teal-600 text-teal-600',
    lime: 'from-lime-500 to-lime-600 text-lime-600',
    fuchsia: 'from-fuchsia-500 to-fuchsia-600 text-fuchsia-600'
  };

  return (
    <div
      onClick={() => router.push(`/tools/${tool.id}`)}
      className="group bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer border border-slate-200 dark:border-slate-700"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[tool.color]} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {tool.name}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{tool.description}</p>
      <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:gap-2 transition-all">
        Try it →
      </div>
    </div>
  );
}
