import libreofficeConvert from 'libreoffice-convert';
import fs from 'fs';
import path from 'path';
import { logger } from '../libs/logger.js';
import { AppError } from '../middleware/errorHandler.js';
import { promisify } from 'util';

const convertAsync = promisify(libreofficeConvert.convert);

export async function pdfToWord(inputPath, outputPath) {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new AppError(`File not found: ${inputPath}`, 404);
    }

    const pdfBuffer = fs.readFileSync(inputPath);
    const docBuffer = await convertAsync({
      input: pdfBuffer,
      inputFormat: 'pdf',
      outputFormat: 'docx',
      timeout: 60000
    });

    fs.writeFileSync(outputPath, docBuffer);
    logger.info(`✅ PDF converted to Word`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error converting PDF to Word', error);
    throw new AppError('Failed to convert PDF to Word. Make sure LibreOffice is installed.', 500);
  }
}

export async function pdfToExcel(inputPath, outputPath) {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new AppError(`File not found: ${inputPath}`, 404);
    }

    const pdfBuffer = fs.readFileSync(inputPath);
    const xlsxBuffer = await convertAsync({
      input: pdfBuffer,
      inputFormat: 'pdf',
      outputFormat: 'xlsx',
      timeout: 60000
    });

    fs.writeFileSync(outputPath, xlsxBuffer);
    logger.info(`✅ PDF converted to Excel`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error converting PDF to Excel', error);
    throw new AppError('Failed to convert PDF to Excel. Make sure LibreOffice is installed.', 500);
  }
}

export async function wordToPDF(inputPath, outputPath) {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new AppError(`File not found: ${inputPath}`, 404);
    }

    const wordBuffer = fs.readFileSync(inputPath);
    const pdfBuffer = await convertAsync({
      input: wordBuffer,
      inputFormat: 'docx',
      outputFormat: 'pdf',
      timeout: 60000
    });

    fs.writeFileSync(outputPath, pdfBuffer);
    logger.info(`✅ Word converted to PDF`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error converting Word to PDF', error);
    throw new AppError('Failed to convert Word to PDF. Make sure LibreOffice is installed.', 500);
  }
}

export async function excelToPDF(inputPath, outputPath) {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new AppError(`File not found: ${inputPath}`, 404);
    }

    const excelBuffer = fs.readFileSync(inputPath);
    const pdfBuffer = await convertAsync({
      input: excelBuffer,
      inputFormat: 'xlsx',
      outputFormat: 'pdf',
      timeout: 60000
    });

    fs.writeFileSync(outputPath, pdfBuffer);
    logger.info(`✅ Excel converted to PDF`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error converting Excel to PDF', error);
    throw new AppError('Failed to convert Excel to PDF. Make sure LibreOffice is installed.', 500);
  }
}

export async function imageToPDF(inputPaths, outputPath) {
  try {
    const images = Array.isArray(inputPaths) ? inputPaths : [inputPaths];
    
    for (const inputPath of images) {
      if (!fs.existsSync(inputPath)) {
        throw new AppError(`File not found: ${inputPath}`, 404);
      }
    }

    if (images.length === 1) {
      const imageBuffer = fs.readFileSync(images[0]);
      const ext = path.extname(images[0]).slice(1).toLowerCase();
      
      const pdfBuffer = await convertAsync({
        input: imageBuffer,
        inputFormat: ext,
        outputFormat: 'pdf',
        timeout: 60000
      });

      fs.writeFileSync(outputPath, pdfBuffer);
    } else {
      throw new AppError('Multiple image to PDF conversion requires advanced PDF library', 501);
    }

    logger.info(`✅ Image converted to PDF`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error converting image to PDF', error);
    throw new AppError('Failed to convert image to PDF: ' + error.message, 500);
  }
}
