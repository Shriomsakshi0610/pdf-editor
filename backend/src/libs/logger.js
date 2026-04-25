const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

class Logger {
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    };
    console.log(JSON.stringify(logEntry, null, 2));
  }

  error(message, error) {
    this.log(LOG_LEVELS.ERROR, message, {
      error: error?.message || error,
      stack: error?.stack
    });
  }

  warn(message, data) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  info(message, data) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data) {
    if (process.env.NODE_ENV !== 'production') {
      this.log(LOG_LEVELS.DEBUG, message, data);
    }
  }
}

export const logger = new Logger();
