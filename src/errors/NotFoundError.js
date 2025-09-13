import AppError from './AppError.js';

/**
 * Represents an error indicating that a requested resource could not be found.
 *
 * This class extends {@link AppError} and sets the default HTTP status code
 * to 404 (Not Found).
 *
 * Use this error when a client requests a resource (such as a vehicle, user, or file)
 * that does not exist in the system.
 *
 * @class NotFoundError
 * @extends AppError
 *
 * @example
 * throw new NotFoundError('Vehicle with ID 123 not found');
 */
export default class NotFoundError extends AppError {
  /**
   * Create a new NotFoundError instance.
   *
   * @param {string} [message='Resource not found'] - Human-readable error message.
   * @param {object|null} [details=null] - Optional additional details about the error.
   */
  constructor(message = 'Resource not found', details = null) {
    super(message, 404, details);
  }
}
