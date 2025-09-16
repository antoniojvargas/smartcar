import { vehicleIdParamSchema, engineActionSchema } from '../schemas/vehicleSchemas.js';
import ValidationError from '../errors/ValidationError.js';

/**
 * Middleware that validates the `vehicleId` route parameter using `vehicleIdParamSchema`.
 *
 * If validation fails, it forwards a {@link ValidationError} to the error handler.
 * Otherwise, it calls `next()` to continue processing the request.
 *
 * @function validateVehicleParams
 * @param {import('express').Request} req - The incoming HTTP request object.
 * @param {import('express').Response} res - The outgoing HTTP response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
export function validateVehicleParams(req, res, next) {
  const { error } = vehicleIdParamSchema.validate(req.params);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  next();
}

/**
 * Middleware that validates both:
 * - the `vehicleId` route parameter using `vehicleIdParamSchema`
 * - the request body using `engineActionSchema`
 *
 * If either validation fails, it forwards a {@link ValidationError} to the error handler.
 * Otherwise, it calls `next()` to continue processing the request.
 *
 * @function validateEngineBody
 * @param {import('express').Request} req - The incoming HTTP request object.
 * @param {import('express').Response} res - The outgoing HTTP response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
export function validateEngineBody(req, res, next) {
  const { error: paramsError } = vehicleIdParamSchema.validate(req.params);
  if (paramsError) {
    return next(new ValidationError(paramsError.details[0].message));
  }

  const { error: bodyError } = engineActionSchema.validate(req.body);

  if (bodyError) {
    return next(new ValidationError(bodyError.details[0].message));
  }

  next();
}
