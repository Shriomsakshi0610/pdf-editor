import express from 'express';
import path from 'path';
import { upload, scheduleFileDeletion } from '../middleware/uploadMiddleware.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  wordToPDF,
  excelToPDF,
  imageToPDF
} from '../utils/conversionUtils.js';

const router = express.Router();
const downloadDir = process.env.DOWNLOAD_DIR || 'downloads';

router.post('/word-to-pdf', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('Word document is required', 400);

    const outputFilename = `converted-${Date.now()}.pdf`;
    const outputPath = path.join(downloadDir, outputFilename);

    await wordToPDF(req.file.path, outputPath);
    scheduleFileDeletion(outputPath);

    res.json({
      success: true,
      message: '✅ Word document converted to PDF successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`
    });
  } catch (error) {
    next(error);
  }
});

router.post('/excel-to-pdf', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('Excel file is required', 400);

    const outputFilename = `converted-${Date.now()}.pdf`;
    const outputPath = path.join(downloadDir, outputFilename);

    await excelToPDF(req.file.path, outputPath);
    scheduleFileDeletion(outputPath);

    res.json({
      success: true,
      message: '✅ Excel file converted to PDF successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`
    });
  } catch (error) {
    next(error);
  }
});

router.post('/image-to-pdf', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('Image file is required', 400);

    const outputFilename = `converted-${Date.now()}.pdf`;
    const outputPath = path.join(downloadDir, outputFilename);

    await imageToPDF(req.file.path, outputPath);
    scheduleFileDeletion(outputPath);

    res.json({
      success: true,
      message: '✅ Image converted to PDF successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
