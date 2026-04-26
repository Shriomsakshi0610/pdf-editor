'use client';

import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

export default function FileUpload({ onFilesSelected, accept, multiple = false, maxSize = 104857600 }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleFiles = (fileList) => {
    const validFiles = [];
    for (let file of fileList) {
      if (file.size > maxSize) {
        alert(`File ${file.name} exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (!multiple && validFiles.length > 1) {
      validFiles.length = 1;
    }

    setFiles(validFiles);
    onFilesSelected(validFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400 dark:text-slate-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          {dragActive ? 'Drop files here' : 'Drag files here or click to select'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Maximum file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="font-semibold text-slate-900 dark:text-white">
            Selected Files ({files.length})
          </h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-3 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  {file.name.split('.').pop().toUpperCase().slice(0, 3)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="ml-2 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
