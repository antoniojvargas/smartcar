import MMApiProvider from '../providers/MMApiProvider.js';
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

const carApiProvider = new MMApiProvider();

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
    const mmResponse = await carApiProvider.getVehicleInfo(id);

    if (!mmResponse) throw new ExternalApiError('No response from MM API');
    if (mmResponse.status === '404') throw new NotFoundError(`Vehicle with id=${id} not found`);
    if (mmResponse.status !== '200') throw new ExternalApiError(`MM API error: ${mmResponse.status}`);

    const data = mmResponse.data || {};
    const vin = data.vin?.value || null;
    const color = data.color?.value || null;
    const driveTrain = data.driveTrain?.value || null;

    let doorCount = null;
    if (data.fourDoorSedan?.value === 'True') doorCount = 4;
    else if (data.twoDoorCoupe?.value === 'True') doorCount = 2;

    if (!vin || !color || !driveTrain || doorCount === null) {
      throw new ExternalApiError('Incomplete data from MM API');
    }

    const responseData = {
      vin, color, doorCount, driveTrain,
    };
    validateResponse(vehicleInfoResponseSchema, responseData, req);

    res.json(responseData);
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
    const mmResponse = await carApiProvider.getSecurityStatus(id);

    if (!mmResponse) throw new ExternalApiError('No response from MM API');
    if (mmResponse.status === '404') throw new NotFoundError(`Vehicle with id=${id} not found`);
    if (mmResponse.status !== '200') throw new ExternalApiError(`MM API error: ${mmResponse.status}`);

    const data = mmResponse.data?.doors?.values;
    if (!Array.isArray(data)) throw new ExternalApiError('Invalid doors data format from MM API');

    const doors = data
      .map((door, index) => {
        const location = door?.location?.value;
        const lockedStr = door?.locked?.value;
        if (typeof location !== 'string' || typeof lockedStr !== 'string') {
          logger.warn(`Skipping invalid door entry at index ${index} for id=${id}`, door);
          return null;
        }
        return { location, locked: lockedStr === 'True' };
      })
      .filter(Boolean);

    validateResponse(doorsResponseSchema, doors, req);

    res.json(doors);
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
    const mmResponse = await carApiProvider.getEnergy(id);

    if (!mmResponse) throw new ExternalApiError('No response from MM API');
    if (mmResponse.status === '404') throw new NotFoundError(`Vehicle with id=${id} not found`);
    if (mmResponse.status !== '200') throw new ExternalApiError(`MM API error: ${mmResponse.status}`);

    const tankLevel = mmResponse.data?.tankLevel;
    if (!tankLevel || tankLevel.type !== 'Number' || !tankLevel.value) {
      throw new ExternalApiError('Fuel data missing or malformed from MM API');
    }

    const responseData = { percent: parseFloat(tankLevel.value) };

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
    const mmResponse = await carApiProvider.getEnergy(id);

    if (!mmResponse) throw new ExternalApiError('No response from MM API');
    if (mmResponse.status === '404') throw new NotFoundError(`Vehicle with id=${id} not found`);
    if (mmResponse.status !== '200') throw new ExternalApiError(`MM API error: ${mmResponse.status}`);

    const batteryLevel = mmResponse.data?.batteryLevel;
    if (!batteryLevel || batteryLevel.type !== 'Number' || !batteryLevel.value) {
      throw new ExternalApiError('Battery data missing or malformed from MM API');
    }

    const responseData = { percent: parseFloat(batteryLevel.value) };

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

    logger.info(`Received engine action request for id=${id}, action=${action}`);
    const normalizedAction = action.toUpperCase();
    const mmCommand = normalizedAction === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE';

    const mmResponse = await carApiProvider.actionEngine(id, mmCommand);

    if (!mmResponse) throw new ExternalApiError('No response from MM API');
    if (mmResponse.status === '404') throw new NotFoundError(`Vehicle with id=${id} not found`);
    if (mmResponse.status !== '200') throw new ExternalApiError(`MM API error: ${mmResponse.status}`);

    const result = mmResponse.actionResult;
    if (!result || typeof result.status !== 'string') {
      throw new ExternalApiError('Malformed response from MM API');
    }

    const status = result.status.toUpperCase();
    let responseData;
    if (status === 'EXECUTED') responseData = { status: 'success' };
    else if (status === 'FAILED') responseData = { status: 'error' };
    else throw new ExternalApiError(`Unexpected status from MM API: ${status}`);

    validateResponse(engineResponseSchema, responseData, req);

    res.json(responseData);
  } catch (error) {
    logger.error(`Unexpected error in postEngine: ${error.message}`, {
      requestId: req.requestId,
      stack: error.stack,
    });
    next(error);
  }
}
