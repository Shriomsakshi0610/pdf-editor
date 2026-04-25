import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import { logger } from '../libs/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export async function mergePDFs(inputPaths, outputPath) {
  try {
    const mergedPDF = await PDFDocument.create();

    for (const inputPath of inputPaths) {
      if (!fs.existsSync(inputPath)) {
        throw new AppError(`File not found: ${inputPath}`, 404);
      }

      const pdfBytes = fs.readFileSync(inputPath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPDF.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPDF.addPage(page));
    }

    const pdfBytes = await mergedPDF.save();
    fs.writeFileSync(outputPath, pdfBytes);
    logger.info(`✅ PDFs merged successfully`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error merging PDFs', error);
    throw new AppError('Failed to merge PDFs: ' + error.message, 500);
  }
}

export async function splitPDF(inputPath, pageIndices, outputPath) {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new AppError(`File not found: ${inputPath}`, 404);
    }

    const pdfBytes = fs.readFileSync(inputPath);
    const originalPDF = await PDFDocument.load(pdfBytes);
    const totalPages = originalPDF.getPageCount();

    for (const index of pageIndices) {
      if (index < 0 || index >= totalPages) {
        throw new AppError(`Invalid page index: ${index}. PDF has ${totalPages} pages`, 400);
      }
    }

    const newPDF = await PDFDocument.create();
    const copiedPages = await newPDF.copyPages(originalPDF, pageIndices);
    copiedPages.forEach(page => newPDF.addPage(page));

    const pdfBytes_out = await newPDF.save();
    fs.writeFileSync(outputPath, pdfBytes_out);
    logger.info(`✅ PDF split successfully`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error splitting PDF', error);
    throw new AppError('Failed to split PDF: ' + error.message, 500);
  }
}

export async function compressPDF(inputPath, outputPath, quality = 75) {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new AppError(`File not found: ${inputPath}`, 404);
    }

    const pdfBytes = fs.readFileSync(inputPath);
    const pdf = await PDFDocument.load(pdfBytes);
    
    const compressedBytes = await pdf.save();
    fs.writeFileSync(outputPath, compressedBytes);
    logger.info(`✅ PDF compressed successfully`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error compressing PDF', error);
    throw new AppError('Failed to compress PDF: ' + error.message, 500);
  }
}

export async function addTextToPDF(inputPath, annotations, outputPath) {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new AppError(`File not found: ${inputPath}`, 404);
    }

    const pdfBytes = fs.readFileSync(inputPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = pdf.getPages();

    for (const annotation of annotations) {
      const { text, x, y, size = 12, color = 'black', pageIndex = 0 } = annotation;

      if (pageIndex < 0 || pageIndex >= pages.length) {
        throw new AppError(`Invalid page index: ${pageIndex}`, 400);
      }

      const page = pages[pageIndex];
      const colorRgb = parseColor(color);

      page.drawText(text, {
        x: parseFloat(x),
        y: parseFloat(y),
        size: parseFloat(size),
        color: colorRgb
      });
    }

    const pdfBytes_out = await pdf.save();
    fs.writeFileSync(outputPath, pdfBytes_out);
    logger.info(`✅ Text added to PDF`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error adding text to PDF', error);
    throw new AppError('Failed to add text to PDF: ' + error.message, 500);
  }
}

export async function getPDFMetadata(filePath) {
  try {
    const pdfBytes = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(pdfBytes);

    return {
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle() || 'N/A',
      author: pdf.getAuthor() || 'N/A',
      subject: pdf.getSubject() || 'N/A',
      creator: pdf.getCreator() || 'N/A',
      creationDate: pdf.getCreationDate()?.toISOString() || 'N/A',
      modificationDate: pdf.getModificationDate()?.toISOString() || 'N/A'
    };
  } catch (error) {
    logger.error('❌ Error reading PDF metadata', error);
    throw new AppError('Failed to read PDF metadata: ' + error.message, 500);
  }
}

function parseColor(color) {
  const colorMap = {
    'red': rgb(1, 0, 0),
    'green': rgb(0, 1, 0),
    'blue': rgb(0, 0, 1),
    'black': rgb(0, 0, 0),
    'yellow': rgb(1, 1, 0),
    'orange': rgb(1, 0.5, 0),
    'purple': rgb(0.5, 0, 0.5)
  };
  return colorMap[color.toLowerCase()] || rgb(0, 0, 0);
}
