import AppError from '../errors/AppError.js';
import logger from '../utils/logger.js';

/**
 * Global error-handling middleware.
 *
 * This function catches all errors thrown in the application.
 * - If the error is an instance of {@link AppError}, it's treated as a known operational error.
 * - Otherwise, it's treated as an unexpected internal error.
 *
 * It logs the error (including the `requestId` if present) and sends a consistent JSON response
 * to the client with the appropriate HTTP status code.
 *
 * @function errorHandler
 * @param {Error} err - The error object thrown during request processing.
 * @param {import('express').Request} req - The incoming HTTP request object.
 * @param {import('express').Response} res - The outgoing HTTP response object.
 * @param {import('express').NextFunction} next - The next middleware function (not used but required by Express).
 * @returns {void}
 */
export function errorHandler(err, req, res, next) {
  const requestId = req.requestId || 'N/A';

  if (err instanceof AppError) {
    // Known operational error
    logger.error(`${err.name}: ${err.message}`, {
      requestId,
      statusCode: err.statusCode,
      details: err.details || null,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      details: err.details || null,
      requestId,
    });
  }

  // Unknown/unexpected error
  logger.error('Unexpected error', {
    requestId,
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong',
    requestId,
  });
}
