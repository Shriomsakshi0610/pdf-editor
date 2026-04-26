'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Image,
  Share2,
  Zap,
  BarChart3,
  Layers,
  Type,
  Scissors,
  ImageIcon,
  Download,
  Merge,
  Minimize2
} from 'lucide-react';
import ToolCard from '../components/ToolCard';

const tools = [
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Convert PDF to editable Word document',
    icon: FileText,
    category: 'PDF Tools',
    color: 'blue'
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Extract data from PDF to Excel spreadsheet',
    icon: BarChart3,
    category: 'PDF Tools',
    color: 'green'
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one',
    icon: Merge,
    category: 'PDF Tools',
    color: 'purple'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract specific pages from PDF',
    icon: Scissors,
    category: 'PDF Tools',
    color: 'orange'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size',
    icon: Minimize2,
    category: 'PDF Tools',
    color: 'red'
  },
  {
    id: 'pdf-editor',
    name: 'PDF Editor',
    description: 'Add text and annotations to PDF',
    icon: Type,
    category: 'PDF Tools',
    color: 'pink'
  },
  {
    id: 'compress-image',
    name: 'Compress Image',
    description: 'Reduce image file size',
    icon: Minimize2,
    category: 'Image Tools',
    color: 'cyan'
  },
  {
    id: 'convert-image',
    name: 'Convert Image',
    description: 'Convert between JPG, PNG, WebP',
    icon: ImageIcon,
    category: 'Image Tools',
    color: 'indigo'
  },
  {
    id: 'resize-image',
    name: 'Resize Image',
    description: 'Scale images to custom dimensions',
    icon: Layers,
    category: 'Image Tools',
    color: 'yellow'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert Word document to PDF',
    icon: FileText,
    category: 'Documents',
    color: 'teal'
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheet to PDF',
    icon: BarChart3,
    category: 'Documents',
    color: 'lime'
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert images to PDF',
    icon: Image,
    category: 'Documents',
    color: 'fuchsia'
  }
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4 fade-in">
          File Conversion & PDF Editor
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto fade-in">
          Convert, compress, and edit PDF, images, and documents online. Fast, secure, and completely free.
        </p>
        <div className="flex justify-center gap-4 flex-wrap fade-in">
          <button
            onClick={() => router.push('/pdf-to-word')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            Get Started
          </button>
          <button
            onClick={() => router.push('#tools')}
            className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold py-3 px-8 rounded-lg border-2 border-blue-600 dark:border-blue-400 transition-all"
          >
            Explore Tools
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Process files instantly' },
            { icon: Share2, title: 'Secure & Private', desc: 'No file storage on servers' },
            { icon: Download, title: 'High Quality', desc: 'Maintain file quality' }
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center shadow-lg"
            >
              <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tools Section */}
      <div id="tools" className="px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-slate-900 dark:text-white">
          All Tools
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12">
          12 powerful tools to handle all your file conversion needs
        </p>

        {/* PDF Tools */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            PDF Tools
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter(t => t.category === 'PDF Tools')
              .map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
          </div>
        </div>

        {/* Image Tools */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white flex items-center gap-2">
            <Image className="w-8 h-8 text-green-600" />
            Image Tools
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter(t => t.category === 'Image Tools')
              .map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
          </div>
        </div>

        {/* Document Tools */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-8 h-8 text-orange-600" />
            Document Conversions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter(t => t.category === 'Documents')
              .map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">Made with ❤️ by Shriom Sakshi</p>
          <p className="text-slate-400 text-sm">© 2026 File Conversion Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
