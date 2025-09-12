import AppError from '../errors/AppError.js';
import logger from '../utils/logger.js';

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
      method: req.method
    });

    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      details: err.details || null,
      requestId
    });
  }

  // Unknown/unexpected error
  logger.error('Unexpected error', {
    requestId,
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong',
    requestId
  });
}
