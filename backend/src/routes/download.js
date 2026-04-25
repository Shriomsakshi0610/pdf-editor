import express from 'express';
import fs from 'fs';
import path from 'path';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();
const downloadDir = process.env.DOWNLOAD_DIR || 'downloads';

router.get('/:fileName', (req, res, next) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(downloadDir, fileName);
    
    if (!filePath.startsWith(path.resolve(downloadDir))) {
      throw new AppError('Invalid file path', 403);
    }

    if (!fs.existsSync(filePath)) {
      throw new AppError('File not found', 404);
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        next(new AppError('Error downloading file: ' + err.message, 500));
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
