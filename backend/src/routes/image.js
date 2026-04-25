import express from 'express';
import fs from 'fs';
import path from 'path';
import { upload, scheduleFileDeletion } from '../middleware/uploadMiddleware.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  compressImage,
  convertImage,
  resizeImage
} from '../utils/imageUtils.js';

const router = express.Router();
const downloadDir = process.env.DOWNLOAD_DIR || 'downloads';

router.post('/compress', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('Image file is required', 400);

    const quality = parseInt(req.body.quality) || 80;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const outputFilename = `compressed-${Date.now()}${ext}`;
    const outputPath = path.join(downloadDir, outputFilename);

    await compressImage(req.file.path, outputPath, quality);
    scheduleFileDeletion(outputPath);

    const originalSize = fs.statSync(req.file.path).size;
    const compressedSize = fs.statSync(outputPath).size;
    const reduction = (((originalSize - compressedSize) / originalSize) * 100).toFixed(2);

    res.json({
      success: true,
      message: '✅ Image compressed successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`,
      stats: {
        originalSizeKB: (originalSize / 1024).toFixed(2),
        compressedSizeKB: (compressedSize / 1024).toFixed(2),
        reductionPercent: reduction
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/convert', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('Image file is required', 400);

    const { format } = req.body;
    if (!format) throw new AppError('Target format is required', 400);

    const outputFilename = `converted-${Date.now()}.${format.toLowerCase()}`;
    const outputPath = path.join(downloadDir, outputFilename);

    await convertImage(req.file.path, outputPath, format);
    scheduleFileDeletion(outputPath);

    res.json({
      success: true,
      message: `✅ Image converted to ${format.toUpperCase()} successfully`,
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`
    });
  } catch (error) {
    next(error);
  }
});

router.post('/resize', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('Image file is required', 400);

    const { width, height } = req.body;
    if (!width || !height) throw new AppError('Width and height are required', 400);

    const ext = path.extname(req.file.originalname).toLowerCase();
    const outputFilename = `resized-${Date.now()}${ext}`;
    const outputPath = path.join(downloadDir, outputFilename);

    await resizeImage(req.file.path, outputPath, width, height);
    scheduleFileDeletion(outputPath);

    res.json({
      success: true,
      message: '✅ Image resized successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
