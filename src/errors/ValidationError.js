import AppError from './AppError.js';

export default class ValidationError extends AppError {
  constructor(message = 'Validation Error', details = null) {
    super(message, 400, details);
  }
}