import { getCarApiProvider } from '../providers/index.js';
import {
  vehicleInfoResponseSchema,
  doorsResponseSchema,
  fuelResponseSchema,
  batteryResponseSchema,
  engineResponseSchema,
} from '../schemas/vehicleSchemas.js';
import { validateResponse } from '../middleware/validateResponse.js';
import ValidationError from '../errors/ValidationError.js';
import ExternalApiError from '../errors/ExternalApiError.js';
import NotFoundError from '../errors/NotFoundError.js';
import logger from '../utils/logger.js';

const carApiProvider = getCarApiProvider();

/**
 * @fileoverview Controller functions for handling vehicle-related routes.
 * These controllers interact with the :contentReference[oaicite:0]{index=0} to fetch data from the :contentReference[oaicite:1]{index=1} platform challenge API,
 * validate responses against :contentReference[oaicite:2]{index=2} schemas, handle errors consistently,
 * and return JSON responses to the client.
 *
 * @module controllers/vehiclesController
 */

/**
 * Retrieves general vehicle information (VIN, color, door count, drive train).
 *
 * @async
 * @function getVehicle
 * @param {import('express').Request} req - Express request object containing `id` as a route parameter.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @throws {ValidationError} If the vehicle ID is missing or invalid.
 * @throws {NotFoundError} If the vehicle is not found in the external API.
 * @throws {ExternalApiError} If the external API returns an error or incomplete data.
 * @returns {Promise<void>} Sends a JSON response with vehicle information.
 */
export async function getVehicle(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) throw new ValidationError('Vehicle ID is required');

    logger.info(`Fetching vehicle info for id=${id}`);
    const result = await carApiProvider.getVehicleInfo(id);

    if (!result) throw new ExternalApiError('No response from MM API');
    if (result.status === '404')
      throw new NotFoundError(`Vehicle with id=${id} not found`);
    if (result.status !== '200')
      throw new ExternalApiError(`MM API error: ${result.status}`);

    validateResponse(vehicleInfoResponseSchema, result.data, req);

    res.json(result.data);
  } catch (error) {
    logger.error(`Unexpected error in getVehicle: ${error.message}`, {
      requestId: req.requestId,
      stack: error.stack,
    });
    next(error);
  }
}

/**
 * Retrieves the lock status of all vehicle doors.
 *
 * @async
 * @function getDoors
 * @param {import('express').Request} req - Express request object containing `id` as a route parameter.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @throws {ValidationError} If the vehicle ID is missing or invalid.
 * @throws {NotFoundError} If the vehicle is not found in the external API.
 * @throws {ExternalApiError} If the external API returns an error or invalid data format.
 * @returns {Promise<void>} Sends a JSON array of doors with their lock status.
 */
export async function getDoors(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) throw new ValidationError('Vehicle ID is required');

    logger.info(`Fetching door status for id=${id}`);
    const result = await carApiProvider.getSecurityStatus(id);

    if (!result) throw new ExternalApiError('No response from MM API');
    if (result.status === '404')
      throw new NotFoundError(`Vehicle with id=${id} not found`);
    if (result.status !== '200')
      throw new ExternalApiError(`MM API error: ${result.status}`);

    validateResponse(doorsResponseSchema, result.data, req);

    res.json(result.data);
  } catch (error) {
    logger.error(`Unexpected error in getDoors: ${error.message}`, {
      requestId: req.requestId,
      stack: error.stack,
    });
    next(error);
  }
}

/**
 * Retrieves the current fuel level of the vehicle.
 *
 * @async
 * @function getFuel
 * @param {import('express').Request} req - Express request object containing `id` as a route parameter.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @throws {ValidationError} If the vehicle ID is missing or invalid.
 * @throws {NotFoundError} If the vehicle is not found in the external API.
 * @throws {ExternalApiError} If the external API returns an error or missing/malformed data.
 * @returns {Promise<void>} Sends a JSON object with the fuel percentage.
 */
export async function getFuel(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) throw new ValidationError('Vehicle ID is required');

    logger.info(`Fetching fuel info for id=${id}`);

    const result = await carApiProvider.getEnergy(id);

    if (!result) throw new ExternalApiError('No response from MM API');
    if (result.status === '404')
      throw new NotFoundError(`Vehicle with id=${id} not found`);
    if (result.status !== '200')
      throw new ExternalApiError(`MM API error: ${result.status}`);

    // result.data.fuel should be a number or null
    let responseData;

    if (result.data.fuel === null) {
      responseData = {
        message:
          'Fuel level information is not available for electric vehicles.',
      };
    } else {
      responseData = { percent: result.data.fuel };
    }

    validateResponse(fuelResponseSchema, responseData, req);

    res.json(responseData);
  } catch (error) {
    logger.error(`Unexpected error in getFuel: ${error.message}`, {
      requestId: req.requestId,
      stack: error.stack,
    });
    next(error);
  }
}

/**
 * Retrieves the current battery level of the vehicle.
 *
 * @async
 * @function getBattery
 * @param {import('express').Request} req - Express request object containing `id` as a route parameter.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @throws {ValidationError} If the vehicle ID is missing or invalid.
 * @throws {NotFoundError} If the vehicle is not found in the external API.
 * @throws {ExternalApiError} If the external API returns an error or missing/malformed data.
 * @returns {Promise<void>} Sends a JSON object with the battery percentage.
 */
export async function getBattery(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) throw new ValidationError('Vehicle ID is required');

    logger.info(`Fetching battery info for id=${id}`);
    const result = await carApiProvider.getEnergy(id);

    if (!result) throw new ExternalApiError('No response from MM API');
    if (result.status === '404')
      throw new NotFoundError(`Vehicle with id=${id} not found`);
    if (result.status !== '200')
      throw new ExternalApiError(`MM API error: ${result.status}`);

    // result.data.battery should be a number or null
    let responseData;
    if (result.data.battery === null) {
      responseData = {
        message:
          'Battery level information is not available for fuel vehicles.',
      };
    } else {
      responseData = { percent: result.data.battery };
    }

    validateResponse(batteryResponseSchema, responseData, req);

    res.json(responseData);
  } catch (error) {
    logger.error(`Unexpected error in getBattery: ${error.message}`, {
      requestId: req.requestId,
      stack: error.stack,
    });
    next(error);
  }
}

/**
 * Sends a command to start or stop the vehicle engine.
 *
 * @async
 * @function postEngine
 * @param {import('express').Request} req - Express request object containing `id` as a route parameter and `action` in the request body.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @throws {ValidationError} If the vehicle ID is missing or the action is invalid.
 * @throws {NotFoundError} If the vehicle is not found in the external API.
 * @throws {ExternalApiError} If the external API returns an error or malformed data.
 * @returns {Promise<void>} Sends a JSON object indicating whether the action was successful.
 */
export async function postEngine(req, res, next) {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!id) throw new ValidationError('Vehicle ID is required');

    if (!action || !['START', 'STOP'].includes(action)) {
      throw new ValidationError("Invalid action. Must be 'START' or 'STOP'.");
    }

    logger.info(
      `Received engine action request for id=${id}, action=${action}`,
    );
    const normalizedAction = action.toUpperCase();
    const mmCommand =
      normalizedAction === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE';

    const result = await carApiProvider.actionEngine(id, mmCommand);

    if (!result) throw new ExternalApiError('No response from MM API');
    if (result.status === '404')
      throw new NotFoundError(`Vehicle with id=${id} not found`);
    if (result.status !== '200')
      throw new ExternalApiError(`MM API error: ${result.status}`);

    validateResponse(engineResponseSchema, result.data, req);

    if (result.data.status === 'success') {
      return res.status(200).json(result.data);
    } else {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Invalid action',
        requestId: req.requestId,
      });
    }
  } catch (error) {
    logger.error(`Unexpected error in postEngine: ${error.message}`, {
      requestId: req.requestId,
      stack: error.stack,
    });
    next(error);
  }
}
