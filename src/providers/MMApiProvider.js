import axios from 'axios';

import { transformVehicleInfoResponse } from '../transformers/vehicleTransformer.js';
import { transformSecurityStatusResponse } from '../transformers/securityTransformer.js';
import { transformEnergyResponse } from '../transformers/energyTransformer.js';
import { transformEngineResponse } from '../transformers/engineTransformer.js';
import { isSuccessResponse } from '../validators/mmApiValidator.js';

const BASE_URL = 'https://platform-challenge.smartcar.com/v1';

/**
 * Concrete implementation of {@link CarApiProvider} that uses the
 * {@link module:services/mmApiService} functions to interact with the
 * external MM API for vehicle data and commands.
 *
 * @class MMApiProvider
 * @extends CarApiProvider
 */
export default class MMApiProvider {
  /**
   * Retrieve basic vehicle information by its ID from the MM API.
   *
   * @override
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the vehicle information.
   */
  async getVehicleInfo(id) {
    const { data: mmResponse } = await axios.post(
      `${BASE_URL}/getVehicleInfoService`,
      {
        id,
        responseType: 'JSON',
      },
    );
    if (!isSuccessResponse(mmResponse))
      return { status: mmResponse?.status ?? '500' };
    return { status: '200', data: transformVehicleInfoResponse(mmResponse) };
  }

  /**
   * Retrieve the security status (e.g. door lock states) of a vehicle by its ID from the MM API.
   *
   * @override
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the security status of the vehicle.
   */
  async getSecurityStatus(id) {
    const { data: mmResponse } = await axios.post(
      `${BASE_URL}/getSecurityStatusService`,
      {
        id,
        responseType: 'JSON',
      },
    );
    if (!isSuccessResponse(mmResponse))
      return { status: mmResponse?.status ?? '500' };
    return { status: '200', data: transformSecurityStatusResponse(mmResponse) };
  }

  /**
   * Retrieve the energy status (e.g. fuel or battery levels) of a vehicle by its ID from the MM API.
   *
   * @override
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the energy status of the vehicle.
   */
  async getEnergy(id) {
    const { data: mmResponse } = await axios.post(
      `${BASE_URL}/getEnergyService`,
      {
        id,
        responseType: 'JSON',
      },
    );
    if (!isSuccessResponse(mmResponse))
      return { status: mmResponse?.status ?? '500' };
    return { status: '200', data: transformEnergyResponse(mmResponse) };
  }

  /**
   * Execute an engine action (e.g. START or STOP) on a vehicle by its ID using the MM API.
   *
   * @override
   * @param {string} id - The unique identifier of the vehicle.
   * @param {string} command - The engine command to execute (e.g. "START_VEHICLE" or "STOP_VEHICLE").
   * @returns {Promise<object>} A promise that resolves with the result of the engine command.
   */
  async actionEngine(id, command) {
    const { data: mmResponse } = await axios.post(
      `${BASE_URL}/actionEngineService`,
      {
        id,
        command,
        responseType: 'JSON',
      },
    );
    if (!isSuccessResponse(mmResponse))
      return { status: mmResponse?.status ?? '500' };
    return { status: '200', data: transformEngineResponse(mmResponse) };
  }
}
