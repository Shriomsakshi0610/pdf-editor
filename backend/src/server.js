import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pdfRoutes from './routes/pdf.js';
import imageRoutes from './routes/image.js';
import documentRoutes from './routes/document.js';
import downloadRoutes from './routes/download.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { logger } from './libs/logger.js';
import { initializeFileCleanup } from './utils/fileCleanup.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || 'downloads';

// Create necessary directories
[UPLOAD_DIR, DOWNLOAD_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.info(`📁 Created directory: ${dir}`);
  }
});

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files for downloads
app.use('/downloads', express.static(DOWNLOAD_DIR));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: '✅ OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// API Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/download', downloadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize periodic file cleanup
initializeFileCleanup();

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📁 Upload directory: ${path.resolve(UPLOAD_DIR)}`);
  logger.info(`📁 Download directory: ${path.resolve(DOWNLOAD_DIR)}`);
  logger.info(`🔄 File retention: ${process.env.FILE_RETENTION_HOURS || 1} hour(s)`);
});

export default app;
