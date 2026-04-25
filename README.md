# File Conversion & PDF Editing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete, production-ready web application for file conversion, PDF editing, and image processing. Similar to Smallpdf and ILovePDF, but fully self-hosted.

## 🌟 Features

### 📄 PDF Tools
- ✅ **PDF to Word** - Convert PDF to editable DOCX
- ✅ **PDF to Excel** - Extract data to XLSX
- ✅ **Merge PDF** - Combine multiple PDFs
- ✅ **Split PDF** - Extract specific pages
- ✅ **Compress PDF** - Reduce file size with quality control
- ✅ **PDF Editor** - Add text, annotations, customize colors and sizes

### 📝 Document Conversions
- ✅ **Word to PDF** - Convert DOCX to PDF
- ✅ **Excel to PDF** - Convert XLSX to PDF
- ✅ **Image to PDF** - Convert JPG/PNG to PDF

### 🖼️ Image Tools
- ✅ **Image Compression** - Reduce image size with quality slider
- ✅ **Image Conversion** - Convert between JPG, PNG, WebP
- ✅ **Image Resize** - Scale to custom dimensions

### ⚡ Advanced Features
- ✅ Drag & drop file upload
- ✅ Multi-file upload support
- ✅ Real-time upload progress
- ✅ Dark/Light mode toggle
- ✅ Mobile responsive design
- ✅ Automatic file cleanup (configurable)
- ✅ Production-ready error handling
- ✅ MIME type validation
- ✅ File size limits (configurable)
- ✅ Secure file storage

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **pdf-lib** - PDF manipulation
- **Sharp** - Image processing
- **LibreOffice Convert** - Document conversion
- **Multer** - File uploads

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **LibreOffice** (for document conversions)
  - Ubuntu/Debian: `sudo apt-get install libreoffice`
  - macOS: `brew install libreoffice`
  - Windows: Download from [libreoffice.org](https://www.libreoffice.org)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Shriomsakshi0610/pdf-editor.git
cd pdf-editor
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Open in Browser

```
http://localhost:3000
```

## 📁 Project Structure

```
pdf-editor/
├── backend/
│   ├── src/
│   │   ├── server.js              # Main server entry
│   │   ├── middleware/
│   │   │   ├── errorHandler.js    # Error handling
│   │   │   └── uploadMiddleware.js # File upload config
│   │   ├── routes/
│   │   │   ├── pdf.js             # PDF operations
│   │   │   ├── image.js           # Image operations
│   │   │   ├── document.js        # Document conversions
│   │   │   └── download.js        # File download
│   │   ├── utils/
│   │   │   ├── pdfUtils.js        # PDF utilities
│   │   │   ├── imageUtils.js      # Image utilities
│   │   │   ├── conversionUtils.js # Conversion utilities
│   │   │   └── fileCleanup.js     # Auto cleanup
│   │   └── libs/
│   │       └── logger.js          # Logging utility
│   ├── uploads/                   # Temporary uploads (gitignored)
│   ├── downloads/                 # Processed files (gitignored)
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── app/
│   │   ├── page.jsx               # Homepage
│   │   ├── layout.jsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── Navbar.jsx             # Navigation
│   │   ├── FileUpload.jsx         # Upload component
│   │   ├── ToolCard.jsx           # Tool grid cards
│   │   ├── ThemeToggle.jsx        # Dark/Light mode
│   │   ├── LoadingSpinner.jsx     # Loading state
│   │   └── PDFEditor.jsx          # PDF editor
│   ├── lib/
│   │   ├── api.js                 # API client
│   │   ├── utils.js               # Utility functions
│   │   └── theme.js               # Theme context
│   ├── package.json
│   ├── next.config.js
│   ├── .env.local
│   └── .gitignore
│
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=104857600        # 100MB in bytes
UPLOAD_DIR=uploads
DOWNLOAD_DIR=downloads

# File Retention
FILE_RETENTION_HOURS=1         # Auto-delete after 1 hour

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_MAX_FILE_SIZE=104857600
```

## 📡 API Endpoints

### PDF Operations

#### Merge PDFs
```bash
POST /api/pdf/merge
Multipart form data: files[] (multiple)
```

#### Split PDF
```bash
POST /api/pdf/split
Form data: file, pageIndices (JSON array)
Example: {"pageIndices": [0, 1, 2]}
```

#### Compress PDF
```bash
POST /api/pdf/compress
Form data: file, quality (1-100, default: 75)
```

#### Add Text to PDF
```bash
POST /api/pdf/add-text
Form data: file, textAnnotations (JSON array)
```

#### PDF to Word
```bash
POST /api/pdf/to-word
Multipart form data: file
```

#### PDF to Excel
```bash
POST /api/pdf/to-excel
Multipart form data: file
```

### Image Operations

#### Compress Image
```bash
POST /api/image/compress
Form data: file, quality (1-100, default: 80)
```

#### Convert Image
```bash
POST /api/image/convert
Form data: file, format (jpg, png, webp)
```

#### Resize Image
```bash
POST /api/image/resize
Form data: file, width, height
```

### Document Conversions

#### Word to PDF
```bash
POST /api/document/word-to-pdf
Multipart form data: file (.docx)
```

#### Excel to PDF
```bash
POST /api/document/excel-to-pdf
Multipart form data: file (.xlsx)
```

#### Image to PDF
```bash
POST /api/document/image-to-pdf
Multipart form data: file (jpg/png)
```

## 🔐 Security Features

- ✅ **MIME Type Validation** - Only allowed file types are processed
- ✅ **File Size Limits** - Default 100MB, configurable
- ✅ **Path Traversal Prevention** - Directory traversal attacks blocked
- ✅ **Automatic Cleanup** - Files deleted after 1 hour (configurable)
- ✅ **Error Handling** - Proper error messages without exposing system info
- ✅ **CORS Protection** - Cross-origin requests from allowed origins only
- ✅ **Input Validation** - All inputs validated before processing

## 🎨 UI/UX Features

- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- 🌓 **Dark/Light Mode** - Toggle between themes
- ⚡ **Real-time Feedback** - Upload progress and status updates
- 🎯 **Intuitive Interface** - Tool cards with clear descriptions
- 🎭 **Smooth Animations** - Hover effects and transitions
- 📊 **File Statistics** - Shows compression ratio and file sizes
- 🔔 **Toast Notifications** - Real-time feedback for all actions

## 📦 Supported Formats

### Input Formats
- **PDF**: application/pdf
- **Word**: .doc, .docx
- **Excel**: .xls, .xlsx
- **Images**: .jpg, .jpeg, .png, .webp

### Output Formats
- **PDF**: From all conversion tools
- **DOCX**: From PDF to Word
- **XLSX**: From PDF to Excel
- **JPG**: From image conversion
- **PNG**: From image conversion
- **WebP**: From image conversion

## 🚀 Deployment

### Deploy on Heroku

1. **Install Heroku CLI**
2. **Create Procfile in backend:**
```
web: node src/server.js
```

3. **Deploy:**
```bash
heroku create your-app-name
git push heroku main
```

### Deploy on Render or Railway

Both platforms support Node.js apps out of the box. Just connect your GitHub repository.

## 🧪 Testing the API

Using cURL:

```bash
# Test health
curl http://localhost:5000/health

# Merge PDFs
curl -F "files=@file1.pdf" -F "files=@file2.pdf" http://localhost:5000/api/pdf/merge

# Compress image
curl -F "file=@image.jpg" -F "quality=80" http://localhost:5000/api/image/compress
```

## 🐛 Troubleshooting

### LibreOffice Not Found

**Error**: `libreoffice-convert: soffice not found`

**Solution**:
```bash
# Ubuntu/Debian
sudo apt-get install libreoffice

# macOS
brew install libreoffice

# Windows
# Download from https://www.libreoffice.org
```

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Update `CORS_ORIGIN` in `backend/.env`

### File Upload Fails

**Error**: `413 Payload Too Large`

**Solution**: Increase `MAX_FILE_SIZE` in `.env`

## 📝 Development Guidelines

### Code Style
- Use ES6+ syntax
- Add JSDoc comments for functions
- Handle errors with try-catch
- Use meaningful variable names
- Keep functions focused and modular

## 📄 License

MIT License - feel free to use this project for commercial or personal purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on GitHub
3. Check existing issues for similar problems

---

**Made with ❤️ by Shriom Sakshi**

Give a ⭐ if you find this project helpful!
