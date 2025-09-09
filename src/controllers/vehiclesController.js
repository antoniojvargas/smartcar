import {
  getVehicleInfo,
  getSecurityStatusService,
  getEnergyService,
  actionEngineService,
} from '../services/mmApiService.js';
import logger from '../utils/logger.js';

export async function getVehicle(req, res) {
  try {
    const { id } = req.params;
    logger.info(`Fetching vehicle info for id=${id}`);
    const mmResponse = await getVehicleInfo(id);

    if (!mmResponse || mmResponse.status !== '200') {
      logger.warn(`MM API error for vehicle id=${id}, status=${mmResponse?.status}`);
      return res.status(502).json({ error: 'MM API error' });
    }

    const data = mmResponse.data || {};
    const vin = data.vin?.value || null;
    const color = data.color?.value || null;
    const driveTrain = data.driveTrain?.value || null;

    let doorCount = null;
    if (data.fourDoorSedan?.value === 'True') {
      doorCount = 4;
    } else if (data.twoDoorCoupe?.value === 'True') {
      doorCount = 2;
    }

    if (!vin || !color || !driveTrain || doorCount === null) {
      logger.error(`Incomplete vehicle data for id=${id}`);
      return res.status(500).json({ error: 'Incomplete data from MM API' });
    }

    res.json({ vin, color, doorCount, driveTrain });
  } catch (error) {
    logger.error(`Unexpected error in getVehicle: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getDoors(req, res) {
  try {
    const { id } = req.params;
    logger.info(`Fetching vehicle info for id=${id}`);
    const mmResponse = await getSecurityStatusService(id);

    if (!mmResponse || mmResponse.status !== '200') {
      logger.warn(`MM API error for vehicle id=${id}, status=${mmResponse?.status}`);
      return res.status(502).json({ error: 'MM API error' });
    }

    const data = mmResponse.data?.doors?.values;
    if (!Array.isArray(data)) {
      logger.error(`Invalid doors data format from MM API for id=${id}`);
      return res.status(500).json({ error: 'Invalid data format from MM API' });
    }

    const doors = data.map((door, index) => {
      const location = door?.location?.value;
      const lockedStr = door?.locked?.value;
      if (typeof location !== 'string' || typeof lockedStr !== 'string') {
        logger.warn(`Skipping invalid door entry at index ${index} for id=${id}`, door);
        return null;
      }
      return { location, locked: lockedStr === 'True' };
    }).filter(Boolean);

    res.json(doors);
  } catch (error) {
    logger.error(`Unexpected error in getDoors: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getFuel(req, res) {
  try {
    const { id } = req.params;
    logger.info(`Fetching vehicle info for id=${id}`);
    const mmResponse = await getEnergyService(id);

    if (!mmResponse || mmResponse.status !== '200') {
      logger.warn(`MM API error for vehicle id=${id}, status=${mmResponse?.status}`);
      return res.status(502).json({ error: 'MM API error' });
    }

    const tankLevel = mmResponse.data?.tankLevel;
    let percent = null;
    if (tankLevel?.type === 'Number' && tankLevel?.value) {
      percent = parseFloat(tankLevel.value);
    } else {
      logger.warn(`Fuel data missing or malformed for id=${id}`);
    }
    res.json({ percent });
  } catch (error) {
    logger.error(`Unexpected error in getFuel: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getBattery(req, res) {
  try {
    const { id } = req.params;
    logger.info(`Fetching vehicle info for id=${id}`);
    const mmResponse = await getEnergyService(id);

    if (!mmResponse || mmResponse.status !== '200') {
      logger.warn(`MM API error for vehicle id=${id}, status=${mmResponse?.status}`);
      return res.status(502).json({ error: 'MM API error' });
    }

    const batteryLevel = mmResponse.data?.batteryLevel;
    let percent = null;
    if (batteryLevel?.type === 'Number' && batteryLevel?.value) {
      percent = parseFloat(batteryLevel.value);
    } else {
      logger.warn(`Battery data missing or malformed for id=${id}`);
    }
    res.json({ percent });
  } catch (error) {
    logger.error(`Unexpected error in getBattery: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function postEngine(req, res) {
  try {
    const { id } = req.params;
    const { action } = req.body;

    logger.info(`Received engine action request for id=${id}, action=${action}`);

    if (!action || !['START', 'STOP'].includes(action)) {
      logger.warn(`Invalid action received for id=${id}: ${action}`);
      return res.status(400).json({ error: "Invalid action. Must be 'START' or 'STOP'." });
    }

    const normalizedAction = action.toUpperCase();
    const mmCommand = normalizedAction === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE';
    const mmResponse = await actionEngineService(id, mmCommand);

    if (!mmResponse || typeof mmResponse !== 'object') {
      logger.error(`No response from MM API for postEngine id=${id}`);
      return res.status(502).json({ error: 'No response from MM API' });
    }
    if (mmResponse.status !== '200') {
      return res.status(502).json({ error: `MM API error: ${mmResponse.status}` });
    }

    const result = mmResponse.actionResult;
    if (!result || typeof result.status !== 'string') {
      logger.error(`Malformed actionResult from MM API for id=${id}`, mmResponse);
      return res.status(500).json({ error: 'Malformed response from MM API' });
    }

    const status = result.status.toUpperCase();
    if (status === 'EXECUTED') {
      logger.info(`Engine action EXECUTED successfully for id=${id}`);
      return res.json({ status: 'success' });
    }
    if (status === 'FAILED') {
      logger.warn(`Engine action FAILED for id=${id}`);
      return res.json({ status: 'error' });
    }
    logger.error(`Unexpected status from MM API for id=${id}: ${status}`);
    return res.status(500).json({ error: `Unexpected status from MM API: ${status}` });
  } catch (error) {
    logger.error(`Unexpected error in postEngine: ${error.message}`, { stack: error.stack });
    res.status(500).json({ error: 'Internal Server Error' });
  }
}