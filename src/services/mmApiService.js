import axios from 'axios';

const BASE_URL = 'https://platform-challenge.smartcar.com/v1';

/**
 * @fileoverview Provides service functions to communicate with the
 * :contentReference[oaicite:2]{index=2} platform API using :contentReference[oaicite:3]{index=3}.
 *
 * Each function sends a POST request to a specific endpoint and returns the parsed response data.
 *
 * @module services/mmApiService
 */

/**
 * Retrieves general vehicle information from the Smartcar API.
 *
 * @async
 * @function getVehicleInfo
 * @param {string} id - The vehicle ID.
 * @returns {Promise<Object>} Resolves with the vehicle information data.
 * @throws {Error} If the request fails.
 */
export async function getVehicleInfo(id) {
  const { data } = await axios.post(`${BASE_URL}/getVehicleInfoService`, {
    id,
    responseType: 'JSON',
  });
  return data;
}

/**
 * Retrieves the security status (door lock states) of a vehicle from the Smartcar API.
 *
 * @async
 * @function getSecurityStatusService
 * @param {string} id - The vehicle ID.
 * @returns {Promise<Object>} Resolves with the security status data.
 * @throws {Error} If the request fails.
 */
export async function getSecurityStatusService(id) {
  const { data } = await axios.post(`${BASE_URL}/getSecurityStatusService`, {
    id,
    responseType: 'JSON',
  });
  return data;
}

/**
 * Retrieves the energy level (fuel or battery) of a vehicle from the Smartcar API.
 *
 * @async
 * @function getEnergyService
 * @param {string} id - The vehicle ID.
 * @returns {Promise<Object>} Resolves with the energy level data.
 * @throws {Error} If the request fails.
 */
export async function getEnergyService(id) {
  const { data } = await axios.post(`${BASE_URL}/getEnergyService`, {
    id,
    responseType: 'JSON',
  });
  return data;
}

/**
 * Sends an engine control command to a vehicle via the Smartcar API.
 *
 * @async
 * @function actionEngineService
 * @param {string} id - The vehicle ID.
 * @param {"START"|"STOP"} command - The engine command to execute.
 * @returns {Promise<Object>} Resolves with the engine action response data.
 * @throws {Error} If the request fails.
 */
export async function actionEngineService(id, command) {
  const { data } = await axios.post(`${BASE_URL}/actionEngineService`, {
    id,
    command,
    responseType: 'JSON',
  });
  return data;
}
