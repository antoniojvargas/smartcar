import logger from '../utils/logger.js';
import ValidationError from '../errors/ValidationError.js';

export function validateResponse(schema, data, req) {
  const { error } = schema.validate(data);
  if (error) {
    const requestId = req.requestId || 'N/A';
    logger.error('Response validation error', {
      requestId,
      details: error.details
    });
    throw new ValidationError('Invalid response format');
  }
  return true;
}
