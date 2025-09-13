import AppError from './AppError.js';

/**
 * Represents an error that occurs when input validation fails.
 *
 * This class extends {@link AppError} and sets the default HTTP status code
 * to 400 (Bad Request).
 *
 * Use this error when the client provides invalid input data, such as
 * failing schema validation or missing required fields.
 *
 * @class ValidationError
 * @extends AppError
 *
 * @example
 * throw new ValidationError('Vehicle ID is required');
 */
export default class ValidationError extends AppError {
  /**
   * Create a new ValidationError instance.
   *
   * @param {string} [message='Validation Error'] - Human-readable error message.
   * @param {object|null} [details=null] - Optional additional details about the validation error.
   */
  constructor(message = 'Validation Error', details = null) {
    super(message, 400, details);
  }
}
