import CarApiProvider from './CarApiProvider.js';
import {
  getVehicleInfo,
  getSecurityStatusService,
  getEnergyService,
  actionEngineService,
} from '../services/mmApiService.js';

/**
 * Concrete implementation of {@link CarApiProvider} that uses the
 * {@link module:services/mmApiService} functions to interact with the
 * external MM API for vehicle data and commands.
 *
 * @class MMApiProvider
 * @extends CarApiProvider
 */
export default class MMApiProvider extends CarApiProvider {
  /**
   * Retrieve basic vehicle information by its ID from the MM API.
   *
   * @override
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the vehicle information.
   */
  async getVehicleInfo(id) {
    return await getVehicleInfo(id);
  }

  /**
   * Retrieve the security status (e.g. door lock states) of a vehicle by its ID from the MM API.
   *
   * @override
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the security status of the vehicle.
   */
  async getSecurityStatus(id) {
    return await getSecurityStatusService(id);
  }

  /**
   * Retrieve the energy status (e.g. fuel or battery levels) of a vehicle by its ID from the MM API.
   *
   * @override
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the energy status of the vehicle.
   */
  async getEnergy(id) {
    return await getEnergyService(id);
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
    return await actionEngineService(id, command);
  }
}
