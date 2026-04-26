'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function PDFEditor({ onAnnotationsChange }) {
  const [annotations, setAnnotations] = useState([
    { text: '', x: 50, y: 50, size: 12, color: 'black', pageIndex: 0 }
  ]);

  const colors = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple'];

  const handleAnnotationChange = (index, field, value) => {
    const newAnnotations = [...annotations];
    newAnnotations[index][field] = value;
    setAnnotations(newAnnotations);
    onAnnotationsChange(newAnnotations);
  };

  const addAnnotation = () => {
    const newAnnotations = [
      ...annotations,
      { text: '', x: 50, y: 50, size: 12, color: 'black', pageIndex: 0 }
    ];
    setAnnotations(newAnnotations);
    onAnnotationsChange(newAnnotations);
  };

  const removeAnnotation = (index) => {
    const newAnnotations = annotations.filter((_, i) => i !== index);
    setAnnotations(newAnnotations);
    onAnnotationsChange(newAnnotations);
  };

  return (
    <div className="space-y-4">
      {annotations.map((annotation, index) => (
        <div
          key={index}
          className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg space-y-3"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-slate-900 dark:text-white">Text #{index + 1}</h4>
            {annotations.length > 1 && (
              <button
                onClick={() => removeAnnotation(index)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Text to add"
            value={annotation.text}
            onChange={(e) => handleAnnotationChange(index, 'text', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                X Position
              </label>
              <input
                type="number"
                value={annotation.x}
                onChange={(e) => handleAnnotationChange(index, 'x', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Y Position
              </label>
              <input
                type="number"
                value={annotation.y}
                onChange={(e) => handleAnnotationChange(index, 'y', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Font Size
              </label>
              <input
                type="number"
                value={annotation.size}
                onChange={(e) => handleAnnotationChange(index, 'size', parseInt(e.target.value))}
                min="8"
                max="72"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Color
              </label>
              <select
                value={annotation.color}
                onChange={(e) => handleAnnotationChange(index, 'color', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addAnnotation}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Text
      </button>
    </div>
  );
}
