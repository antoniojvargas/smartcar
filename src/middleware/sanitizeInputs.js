import validator from 'validator';
const { escape } = validator;
import { validationResult } from 'express-validator';

/**
 * Recursively escapes all string properties in an object.
 * @param {object} obj
 */
function deepEscape(obj) {
  if (!obj || typeof obj !== 'object') return;

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (typeof value === 'string') {
      obj[key] = escape(value);
    } else if (typeof value === 'object' && value !== null) {
      deepEscape(value);
    }
  }
}

/**
 * Express middleware to sanitize all user input fields.
 */
export function sanitizeInputs(req, res, next) {
  try {
    if (req.body) deepEscape(req.body);
    if (req.query) deepEscape(req.query);
    if (req.params) deepEscape(req.params);
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware to sanitize the `id` parameter in routes like /vehicles/:id
 */
export function sanitizeVehicleId(req, res, next) {
  try {
    if (req.params && typeof req.params.id === 'string') {
      req.params.id = escape(req.params.id);
    }
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware to handle validation errors from express-validator.
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * Middleware to sanitize the `action` field in the request body for engine commands.
 */
export function sanitizeEngineAction(req, res, next) {
  try {
    if (req.body && typeof req.body.action === 'string') {
      req.body.action = escape(req.body.action);
    }
    next();
  } catch (err) {
    next(err);
  }
} 
