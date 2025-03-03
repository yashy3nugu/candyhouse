import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { LOG_DIR } from '@config';

// logs dir - use a simple, consistent path
const logDir: string = join(__dirname, '..', '..', 'logs');

// Create log directory if it doesn't exist
if (!existsSync(logDir)) {
  try {
    mkdirSync(logDir, { recursive: true });
  } catch (error) {
    console.warn(`Unable to create log directory at ${logDir}, falling back to console-only logging`);
  }
}

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // Always log to console
    new winston.transports.Console({
      format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
    }),
  ],
});

// Add file transports only if we successfully created the log directory
if (existsSync(logDir)) {
  logger.add(
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/debug`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    })
  );
  
  logger.add(
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    })
  );
}

// Stream for Morgan (HTTP request logging)
const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream };
