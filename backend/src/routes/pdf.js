import express from 'express';
import fs from 'fs';
import path from 'path';
import { upload, scheduleFileDeletion } from '../middleware/uploadMiddleware.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  mergePDFs,
  splitPDF,
  compressPDF,
  addTextToPDF,
  getPDFMetadata
} from '../utils/pdfUtils.js';
import {
  pdfToWord,
  pdfToExcel,
  wordToPDF,
  excelToPDF
} from '../utils/conversionUtils.js';
import { logger } from '../libs/logger.js';

const router = express.Router();
const downloadDir = process.env.DOWNLOAD_DIR || 'downloads';

router.post('/merge', upload.array('files', 20), async (req, res, next) => {
  try {
    if (!req.files || req.files.length < 2) {
      throw new AppError('At least 2 PDF files are required', 400);
    }

    const inputPaths = req.files.map(file => file.path);
    const outputFilename = `merged-${Date.now()}.pdf`;
    const outputPath = path.join(downloadDir, outputFilename);

    await mergePDFs(inputPaths, outputPath);
    scheduleFileDeletion(outputPath);

    res.json({
      success: true,
      message: '✅ PDFs merged successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`
    });
  } catch (error) {
    next(error);
  }
});

router.post('/split', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('PDF file is required', 400);

    const { pageIndices } = req.body;
    if (!pageIndices || !Array.isArray(JSON.parse(pageIndices))) {
      throw new AppError('pageIndices array is required', 400);
    }

    const indices = JSON.parse(pageIndices).map(i => parseInt(i));
    const outputFilename = `split-${Date.now()}.pdf`;
    const outputPath = path.join(downloadDir, outputFilename);

    await splitPDF(req.file.path, indices, outputPath);
    scheduleFileDeletion(outputPath);

    res.json({
      success: true,
      message: '✅ PDF split successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`
    });
  } catch (error) {
    next(error);
  }
});

router.post('/compress', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('PDF file is required', 400);

    const quality = parseInt(req.body.quality) || 75;
    const outputFilename = `compressed-${Date.now()}.pdf`;
    const outputPath = path.join(downloadDir, outputFilename);

    await compressPDF(req.file.path, outputPath, quality);
    scheduleFileDeletion(outputPath);

    const originalSize = fs.statSync(req.file.path).size;
    const compressedSize = fs.statSync(outputPath).size;
    const reduction = (((originalSize - compressedSize) / originalSize) * 100).toFixed(2);

    res.json({
      success: true,
      message: '✅ PDF compressed successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`,
      stats: {
        originalSizeMB: (originalSize / 1024 / 1024).toFixed(2),
        compressedSizeMB: (compressedSize / 1024 / 1024).toFixed(2),
        reductionPercent: reduction
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/add-text', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('PDF file is required', 400);

    const { textAnnotations } = req.body;
    const annotations = typeof textAnnotations === 'string' 
      ? JSON.parse(textAnnotations) 
      : textAnnotations;

    if (!Array.isArray(annotations)) {
      throw new AppError('textAnnotations must be an array', 400);
    }

    const outputFilename = `annotated-${Date.now()}.pdf`;
    const outputPath = path.join(downloadDir, outputFilename);

    await addTextToPDF(req.file.path, annotations, outputPath);
    scheduleFileDeletion(outputPath);

    res.json({
      success: true,
      message: '✅ Text added to PDF successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`
    });
  } catch (error) {
    next(error);
  }
});

router.post('/to-word', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('PDF file is required', 400);

    const outputFilename = `converted-${Date.now()}.docx`;
    const outputPath = path.join(downloadDir, outputFilename);

    await pdfToWord(req.file.path, outputPath);
    scheduleFileDeletion(outputPath);

    res.json({
      success: true,
      message: '✅ PDF converted to Word successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`
    });
  } catch (error) {
    next(error);
  }
});

router.post('/to-excel', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('PDF file is required', 400);

    const outputFilename = `converted-${Date.now()}.xlsx`;
    const outputPath = path.join(downloadDir, outputFilename);

    await pdfToExcel(req.file.path, outputPath);
    scheduleFileDeletion(outputPath);

    res.json({
      success: true,
      message: '✅ PDF converted to Excel successfully',
      fileName: outputFilename,
      downloadUrl: `/downloads/${outputFilename}`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
