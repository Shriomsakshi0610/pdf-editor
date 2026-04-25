import fs from 'fs';
import path from 'path';
import { logger } from '../libs/logger.js';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || 'downloads';
const FILE_RETENTION_HOURS = parseInt(process.env.FILE_RETENTION_HOURS) || 1;

function cleanupDirectory(directory, hoursToKeep) {
  try {
    if (!fs.existsSync(directory)) return;

    const files = fs.readdirSync(directory);
    const now = Date.now();
    let deletedCount = 0;

    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      const fileAgeHours = (now - stats.mtimeMs) / (1000 * 60 * 60);

      if (fileAgeHours > hoursToKeep) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      logger.info(`🧹 Cleanup: ${deletedCount} files deleted from ${directory}`);
    }
  } catch (error) {
    logger.error(`Error cleaning up directory ${directory}:`, error);
  }
}

export function initializeFileCleanup() {
  const cleanupInterval = 30 * 60 * 1000;

  setInterval(() => {
    cleanupDirectory(UPLOAD_DIR, FILE_RETENTION_HOURS);
    cleanupDirectory(DOWNLOAD_DIR, FILE_RETENTION_HOURS);
  }, cleanupInterval);

  cleanupDirectory(UPLOAD_DIR, FILE_RETENTION_HOURS);
  cleanupDirectory(DOWNLOAD_DIR, FILE_RETENTION_HOURS);
}
