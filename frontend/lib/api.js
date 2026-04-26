import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pdf-editor-whff.onrender.com';
NEXT_PUBLIC_API_BASE_URL = 'https://pdf-editor-whff.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

// PDF Operations
export const pdfApi = {
  merge: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return api.post('/api/pdf/merge', formData);
  },

  split: (file, pageIndices) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageIndices', JSON.stringify(pageIndices));
    return api.post('/api/pdf/split', formData);
  },

  compress: (file, quality = 75) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);
    return api.post('/api/pdf/compress', formData);
  },

  addText: (file, annotations) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('textAnnotations', JSON.stringify(annotations));
    return api.post('/api/pdf/add-text', formData);
  },

  toPDF: (file, type = 'word') => {
    const formData = new FormData();
    formData.append('file', file);
    const endpoint = type === 'word' ? '/api/pdf/to-word' : '/api/pdf/to-excel';
    return api.post(endpoint, formData);
  }
};

// Image Operations
export const imageApi = {
  compress: (file, quality = 80) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);
    return api.post('/api/image/compress', formData);
  },

  convert: (file, format) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    return api.post('/api/image/convert', formData);
  },

  resize: (file, width, height) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('width', width);
    formData.append('height', height);
    return api.post('/api/image/resize', formData);
  }
};

// Document Conversions
export const documentApi = {
  wordToPDF: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/document/word-to-pdf', formData);
  },

  excelToPDF: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/document/excel-to-pdf', formData);
  },

  imageToPDF: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/document/image-to-pdf', formData);
  }
};

// Download file
export const downloadFile = (fileName) => {
  window.open(`${API_BASE_URL}/downloads/${fileName}`, '_blank');
};

export default api;
