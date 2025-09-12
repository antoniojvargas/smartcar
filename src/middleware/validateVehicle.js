import { vehicleIdParamSchema, engineActionSchema } from '../schemas/vehicleSchemas.js';
import ValidationError from '../errors/ValidationError.js';

export function validateVehicleParams(req, res, next) {
  const { error } = vehicleIdParamSchema.validate(req.params);
  if (error) {
    return next(new ValidationError(error.details[0].message));
  }

  next();
}

export function validateEngineBody(req, res, next) {
  const { error: paramsError } = vehicleIdParamSchema.validate(req.params);
  if (paramsError) {
    return next(new ValidationError(paramsError.details[0].message));
  }

  const { error: bodyError } = engineActionSchema.validate(req.body);
  if (bodyError) {
    return next(new ValidationError(paramsError.details[0].message));
  }

  next();
}
