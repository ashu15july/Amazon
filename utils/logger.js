// Simple logger implementation
// For production, consider using winston or similar

const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'INFO';
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}\n`;
  }

  writeToFile(level, message, meta) {
    const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
    const formattedMessage = this.formatMessage(level, message, meta);
    
    try {
      fs.appendFileSync(logFile, formattedMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  log(level, message, meta = {}) {
    if (logLevels[level] <= logLevels[this.logLevel]) {
      const formattedMessage = this.formatMessage(level, message, meta);
      console.log(formattedMessage.trim());
      this.writeToFile(level, message, meta);
    }
  }

  error(message, meta) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta) {
    this.log('WARN', message, meta);
  }

  info(message, meta) {
    this.log('INFO', message, meta);
  }

  debug(message, meta) {
    this.log('DEBUG', message, meta);
  }
}

const logger = new Logger();

module.exports = logger;

