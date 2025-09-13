/**
 * Base class for application-specific (operational) errors.
 *
 * This class extends the built-in {@link Error} object to include:
 * - An HTTP status code for proper response handling
 * - Optional structured details to provide more context about the error
 *
 * All custom error types in the application (e.g. ValidationError, NotFoundError)
 * should extend this class to ensure consistent error handling and logging.
 *
 * @class AppError
 * @extends Error
 *
 * @example
 * throw new AppError('Resource not found', 404);
 */

export default class AppError extends Error {
  /**
   * Create a new AppError instance.
   *
   * @param {string} message - Human-readable error message.
   * @param {number} [statusCode=500] - HTTP status code to return (default: 500 Internal Server Error).
   * @param {object|null} [details=null] - Optional additional details about the error.
   */
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
