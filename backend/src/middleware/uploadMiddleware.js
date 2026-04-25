import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../libs/logger.js';
import { AppError } from './errorHandler.js';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 104857600;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`❌ File type ${file.mimetype} is not supported`, 400), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 20
  }
});

export const scheduleFileDeletion = (filePath, hours = 1) => {
  const deleteTime = hours * 60 * 60 * 1000;
  setTimeout(() => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`🗑️ Deleted temporary file: ${filePath}`);
      }
    } catch (error) {
      logger.error(`Error deleting file ${filePath}`, error);
    }
  }, deleteTime);
};
