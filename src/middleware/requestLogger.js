import { v4 as uuidv4 } from 'uuid';
import onHeaders from 'on-headers';
import logger from '../utils/logger.js';

/**
 * Express middleware that logs incoming HTTP requests and their responses,
 * assigning a unique request ID to each request for correlation across services.
 *
 * The middleware:
 * - Generates a UUID as a request ID
 * - Attaches the request ID to both the `req` object and the response headers
 * - Logs the incoming request details
 * - Logs the response status code and response time when the response is sent
 *
 * @function requestLogger
 * @param {import('express').Request} req - The incoming HTTP request object.
 * @param {import('express').Response} res - The outgoing HTTP response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
export function requestLogger(req, res, next) {
  const requestId = uuidv4();
  const startTime = process.hrtime();

  req.requestId = requestId;

  // Attach requestId to response header
  res.setHeader('X-Request-Id', requestId);

  // Log when response is about to be sent
  onHeaders(res, () => {
    const diff = process.hrtime(startTime);
    const responseTimeMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTimeMs,
    });
  });

  // Log incoming request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  next();
}
