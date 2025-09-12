import { v4 as uuidv4 } from 'uuid';
import onHeaders from 'on-headers';
import logger from '../utils/logger.js';

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
