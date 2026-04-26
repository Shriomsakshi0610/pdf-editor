'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import FileUpload from '../../../components/FileUpload';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PDFEditor from '../../../components/PDFEditor';
import { pdfApi, imageApi, documentApi, downloadFile } from '../../../lib/api';

const toolConfigs = {
  'pdf-to-word': {
    title: 'PDF to Word',
    description: 'Convert your PDF to an editable Word document',
    accept: '.pdf',
    multiple: false,
    api: (file) => pdfApi.toPDF(file, 'word')
  },
  'pdf-to-excel': {
    title: 'PDF to Excel',
    description: 'Extract data from PDF to Excel spreadsheet',
    accept: '.pdf',
    multiple: false,
    api: (file) => pdfApi.toPDF(file, 'excel')
  },
  'merge-pdf': {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one',
    accept: '.pdf',
    multiple: true,
    api: (files) => pdfApi.merge(files)
  },
  'split-pdf': {
    title: 'Split PDF',
    description: 'Extract specific pages from PDF',
    accept: '.pdf',
    multiple: false,
    hasOptions: true
  },
  'compress-pdf': {
    title: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    accept: '.pdf',
    multiple: false,
    hasQuality: true
  },
  'pdf-editor': {
    title: 'PDF Editor',
    description: 'Add text and annotations to PDF',
    accept: '.pdf',
    multiple: false,
    hasEditor: true
  },
  'compress-image': {
    title: 'Compress Image',
    description: 'Reduce image file size',
    accept: 'image/*',
    multiple: false,
    hasQuality: true,
    api: (file, quality) => imageApi.compress(file, quality)
  },
  'convert-image': {
    title: 'Convert Image',
    description: 'Convert between JPG, PNG, WebP formats',
    accept: 'image/*',
    multiple: false,
    hasFormat: true
  },
  'resize-image': {
    title: 'Resize Image',
    description: 'Scale images to custom dimensions',
    accept: 'image/*',
    multiple: false,
    hasDimensions: true
  },
  'word-to-pdf': {
    title: 'Word to PDF',
    description: 'Convert Word document to PDF',
    accept: '.doc,.docx',
    multiple: false,
    api: (file) => documentApi.wordToPDF(file)
  },
  'excel-to-pdf': {
    title: 'Excel to PDF',
    description: 'Convert Excel spreadsheet to PDF',
    accept: '.xls,.xlsx',
    multiple: false,
    api: (file) => documentApi.excelToPDF(file)
  },
  'image-to-pdf': {
    title: 'Image to PDF',
    description: 'Convert images to PDF',
    accept: 'image/*',
    multiple: false,
    api: (file) => documentApi.imageToPDF(file)
  }
};

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolId = params.id;
  const config = toolConfigs[toolId];

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState('jpg');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [pageIndices, setPageIndices] = useState('');
  const [annotations, setAnnotations] = useState([]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Tool Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    try {
      let response;

      if (toolId === 'split-pdf') {
        const indices = pageIndices.split(',').map(i => parseInt(i.trim()));
        response = await pdfApi.split(files[0], indices);
      } else if (toolId === 'compress-pdf') {
        response = await pdfApi.compress(files[0], quality);
      } else if (toolId === 'pdf-editor') {
        response = await pdfApi.addText(files[0], annotations);
      } else if (toolId === 'convert-image') {
        response = await imageApi.convert(files[0], format);
      } else if (toolId === 'resize-image') {
        response = await imageApi.resize(files[0], width, height);
      } else {
        response = await config.api(files[0], quality);
      }

      setResult(response.data);
      toast.success('Conversion successful!');
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error(error.response?.data?.message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{config.title}</h1>
          <p className="text-slate-600 dark:text-slate-400">{config.description}</p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Upload File</h2>
              <FileUpload
                onFilesSelected={setFiles}
                accept={config.accept}
                multiple={config.multiple}
              />

              {/* Options */}
              {config.hasQuality && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {config.hasFormat && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Target Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>
              )}

              {config.hasDimensions && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {config.hasOptions && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Page Indices (comma-separated, e.g., 0,2,3)
                  </label>
                  <input
                    type="text"
                    value={pageIndices}
                    onChange={(e) => setPageIndices(e.target.value)}
                    placeholder="0,1,2"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              {config.hasEditor && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Text Annotations
                  </h3>
                  <PDFEditor onAnnotationsChange={setAnnotations} />
                </div>
              )}

              <button
                onClick={handleConvert}
                disabled={files.length === 0 || loading}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : 'Convert Now'}
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg h-fit sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Result</h2>
              {result ? (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-300 font-semibold text-sm">
                      ✅ {result.message}
                    </p>
                  </div>

                  {result.stats && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2 text-sm">
                      {result.stats.originalSizeMB && (
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>Original:</strong> {result.stats.originalSizeMB}MB
                        </p>
                      )}
                      {result.stats.compressedSizeMB && (
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>Compressed:</strong> {result.stats.compressedSizeMB}MB
                        </p>
                      )}
                      {result.stats.reductionPercent && (
                        <p className="text-green-700 dark:text-green-400 font-semibold">
                          ⬇️ {result.stats.reductionPercent}% smaller
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => downloadFile(result.fileName)}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>

                  <button
                    onClick={() => {
                      setResult(null);
                      setFiles([]);
                    }}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Convert Another
                  </button>
                </div>
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <p>Upload a file to see results here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner message="Processing your file..." />}
    </div>
  );
}
