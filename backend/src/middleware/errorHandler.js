import { logger } from '../libs/logger.js';

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  logger.error(`${err.statusCode} - ${err.message}`, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl
  });

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: '❌ File size exceeds maximum allowed size (100MB)'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      success: false,
      message: '❌ Too many files uploaded at once'
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: '❌ Something went wrong. Please try again later.'
  });
};
