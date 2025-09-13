import logger from '../utils/logger.js';
import ValidationError from '../errors/ValidationError.js';

/**
 * Validates the given response data against a schema.
 *
 * @function validateResponse
 * @param {import('joi').Schema} schema - The Joi schema to validate the data against.
 * @param {Object} data - The response data to validate.
 * @param {import('express').Response} res - The Express response object.
 * @param {string} [reqId] - Optional request correlation ID to include in logs.
 * @throws {ValidationError} If the response data does not match the schema.
 * @returns {boolean} Returns `true` if validation passes.
 */
export function validateResponse(schema, data, req) {
  const { error } = schema.validate(data);
  if (error) {
    const requestId = req.requestId || 'N/A';
    logger.error('Response validation error', {
      requestId,
      details: error.details,
    });
    throw new ValidationError('Invalid response format');
  }
  return true;
}
