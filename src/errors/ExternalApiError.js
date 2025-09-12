import AppError from './AppError.js';

export default class ExternalApiError extends AppError {
  constructor(message = 'External API Error', statusCode = 502, details = null) {
    super(message, statusCode, details);
  }
}