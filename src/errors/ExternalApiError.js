import AppError from './AppError.js';

/**
 * Represents an error that occurs when interacting with an external API.
 *
 * This class extends {@link AppError} to indicate that the error source
 * is an external dependency or service, such as a third-party API.
 *
 * It defaults to the HTTP status code 502 (Bad Gateway) to reflect
 * failures in upstream services.
 *
 * @class ExternalApiError
 * @extends AppError
 *
 * @example
 * throw new ExternalApiError('Failed to fetch data from payment service', 502, { service: 'PaymentsAPI' });
 */
export default class ExternalApiError extends AppError {
  /**
   * Create a new ExternalApiError instance.
   *
   * @param {string} [message='External API Error'] - Human-readable error message.
   * @param {number} [statusCode=502] - HTTP status code to return (default: 502 Bad Gateway).
   * @param {object|null} [details=null] - Optional additional details about the error.
   */
  constructor(message = 'External API Error', statusCode = 502, details = null) {
    super(message, statusCode, details);
  }
}
