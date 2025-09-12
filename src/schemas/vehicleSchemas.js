import Joi from 'joi';

// ─── Request Schemas ──────────────────────────────

export const vehicleIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^\d+$/) // numeric id
    .required()
    .messages({
      'string.pattern.base': 'Vehicle ID must be a numeric string',
      'any.required': 'Vehicle ID is required'
    })
});

export const engineActionSchema = Joi.object({
  action: Joi.string()
    .valid('START', 'STOP')
    .required()
    .messages({
      'any.only': 'Action must be either START or STOP',
      'any.required': 'Action is required'
    })
});

// ─── Response Schemas ──────────────────────────────

// GET /vehicles/:id
export const vehicleInfoResponseSchema = Joi.object({
  vin: Joi.string().required(),
  color: Joi.string().required(),
  doorCount: Joi.number().integer().valid(2, 4).required(),
  driveTrain: Joi.string().required()
});

// GET /vehicles/:id/doors
export const doorsResponseSchema = Joi.array().items(
  Joi.object({
    location: Joi.string().valid('frontLeft', 'frontRight', 'backLeft', 'backRight').required(),
    locked: Joi.boolean().required()
  })
);

// GET /vehicles/:id/fuel
export const fuelResponseSchema = Joi.object({
  percent: Joi.number().min(0).max(100).required()
});

// GET /vehicles/:id/battery
export const batteryResponseSchema = Joi.object({
  percent: Joi.number().min(0).max(100).required()
});

// POST /vehicles/:id/engine
export const engineResponseSchema = Joi.object({
  status: Joi.string().valid('success', 'error').required()
});