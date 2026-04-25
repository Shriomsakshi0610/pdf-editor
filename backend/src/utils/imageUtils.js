import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { logger } from '../libs/logger.js';
import { AppError } from '../middleware/errorHandler.js';

export async function compressImage(inputPath, outputPath, quality = 80) {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new AppError(`File not found: ${inputPath}`, 404);
    }

    const ext = path.extname(inputPath).toLowerCase();
    let pipeline = sharp(inputPath);

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality, progressive: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ quality: Math.floor(quality / 10) });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality });
    }

    await pipeline.toFile(outputPath);
    logger.info(`✅ Image compressed`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error compressing image', error);
    throw new AppError('Failed to compress image: ' + error.message, 500);
  }
}

export async function convertImage(inputPath, outputPath, targetFormat) {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new AppError(`File not found: ${inputPath}`, 404);
    }

    const format = targetFormat.toLowerCase();
    let pipeline = sharp(inputPath);

    switch (format) {
      case 'jpg':
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality: 90, progressive: true });
        break;
      case 'png':
        pipeline = pipeline.png({ quality: 9 });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality: 90 });
        break;
      default:
        throw new AppError(`Unsupported format: ${format}`, 400);
    }

    await pipeline.toFile(outputPath);
    logger.info(`✅ Image converted to ${format}`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error converting image', error);
    throw new AppError('Failed to convert image: ' + error.message, 500);
  }
}

export async function resizeImage(inputPath, outputPath, width, height) {
  try {
    if (!fs.existsSync(inputPath)) {
      throw new AppError(`File not found: ${inputPath}`, 404);
    }

    await sharp(inputPath)
      .resize(parseInt(width), parseInt(height), { fit: 'inside', withoutEnlargement: true })
      .toFile(outputPath);

    logger.info(`✅ Image resized`);
    return outputPath;
  } catch (error) {
    logger.error('❌ Error resizing image', error);
    throw new AppError('Failed to resize image: ' + error.message, 500);
  }
}

export async function getImageMetadata(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      hasAlpha: metadata.hasAlpha,
      space: metadata.space,
      channels: metadata.channels,
      depth: metadata.depth,
      isProgressive: metadata.isProgressive,
      density: metadata.density,
      hasProfile: metadata.hasProfile
    };
  } catch (error) {
    logger.error('❌ Error reading image metadata', error);
    throw new AppError('Failed to read image metadata: ' + error.message, 500);
  }
}
