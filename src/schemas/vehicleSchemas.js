import Joi from 'joi';

/**
 * @fileoverview Defines :contentReference[oaicite:1]{index=1} validation schemas for request parameters, request bodies, and responses
 * used by the vehicle-related API endpoints.
 *
 * @module schemas/vehicleSchemas
 */

/* ─── Request Schemas ────────────────────────────── */

/**
 * Schema to validate vehicle ID path parameter.
 * Ensures the `id` is a required numeric string.
 *
 * @type {Joi.ObjectSchema}
 * @example
 * // Valid
 * { id: "123" }
 *
 * // Invalid
 * { id: "abc" }
 */
export const vehicleIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.pattern.base': 'Vehicle ID must be a numeric string',
      'any.required': 'Vehicle ID is required',
    }),
});

/**
 * Schema to validate the engine action request body.
 * Ensures the `action` is either "START" or "STOP".
 *
 * @type {Joi.ObjectSchema}
 * @example
 * // Valid
 * { action: "START" }
 *
 * // Invalid
 * { action: "RUN" }
 */
export const engineActionSchema = Joi.object({
  action: Joi.string()
    .valid('START', 'STOP')
    .required()
    .messages({
      'any.only': 'Action must be either START or STOP',
      'any.required': 'Action is required',
    }),
});

/* ─── Response Schemas ────────────────────────────── */

/**
 * Schema for the response of GET /vehicles/:id.
 * Describes vehicle information fields.
 *
 * @type {Joi.ObjectSchema}
 */
export const vehicleInfoResponseSchema = Joi.object({
  vin: Joi.string().required(),
  color: Joi.string().required(),
  doorCount: Joi.number().integer().valid(2, 4).required(),
  driveTrain: Joi.string().required(),
});

/**
 * Schema for the response of GET /vehicles/:id/doors.
 * Each item describes the door location and locked status.
 *
 * @type {Joi.ArraySchema}
 */
export const doorsResponseSchema = Joi.array().items(
  Joi.object({
    location: Joi.string().valid('frontLeft', 'frontRight', 'backLeft', 'backRight').required(),
    locked: Joi.boolean().required(),
  }),
);

/**
 * Schema for the response of GET /vehicles/:id/fuel.
 * Contains the fuel level as a percentage.
 *
 * @type {Joi.ObjectSchema}
 */
export const fuelResponseSchema = Joi.object({
  percent: Joi.number().min(0).max(100).required(),
});

/**
 * Schema for the response of GET /vehicles/:id/battery.
 * Contains the battery level as a percentage.
 *
 * @type {Joi.ObjectSchema}
 */
export const batteryResponseSchema = Joi.object({
  percent: Joi.number().min(0).max(100).required(),
});

/**
 * Schema for the response of POST /vehicles/:id/engine.
 * Indicates the status of the engine action.
 *
 * @type {Joi.ObjectSchema}
 */
export const engineResponseSchema = Joi.object({
  status: Joi.string().valid('success', 'error').required(),
});
