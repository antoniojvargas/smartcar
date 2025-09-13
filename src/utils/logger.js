import winston from 'winston';

/**
 * @fileoverview Configures and exports a :contentReference[oaicite:1]{index=1} logger instance.
 *
 * The logger is configured with:
 * - A default log level of `info`
 * - Timestamped JSON formatting for logs
 * - Console transport with colorized simple output
 * - File transports for error logs (`logs/error.log`) and all logs (`logs/combined.log`)
 *
 * This logger can be used throughout the application for consistent logging of
 * informational messages, warnings, and errors.
 *
 * @module utils/logger
 */

/**
 * A configured winston logger instance used for application-wide logging.
 *
 * @type {import('winston').Logger}
 */
const logger = winston.createLogger({
  level: 'info', // default level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
