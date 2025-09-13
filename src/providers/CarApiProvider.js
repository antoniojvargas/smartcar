/**
 * Abstract base class that defines the interface for car API providers.
 *
 * This class serves as a contract for fetching and controlling vehicle data.
 * Concrete implementations (e.g. MMApiProvider) should extend this class
 * and implement all of its methods to interact with an external car API.
 *
 * @abstract
 * @class CarApiProvider
 */
export default class CarApiProvider {
  /**
   * Retrieve basic vehicle information by its ID.
   *
   * @abstract
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the vehicle information.
   * @throws {Error} If the method is not implemented by the subclass.
   */
  async getVehicleInfo(id) {
    throw new Error('getVehicleInfo not implemented');
  }

  /**
   * Retrieve the security status (e.g. door lock states) of a vehicle by its ID.
   *
   * @abstract
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the security status of the vehicle.
   * @throws {Error} If the method is not implemented by the subclass.
   */
  async getSecurityStatus(id) {
    throw new Error('getSecurityStatus not implemented');
  }

  /**
   * Retrieve the energy status (e.g. fuel or battery levels) of a vehicle by its ID.
   *
   * @abstract
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the energy status of the vehicle.
   * @throws {Error} If the method is not implemented by the subclass.
   */
  async getEnergy(id) {
    throw new Error('getEnergy not implemented');
  }

  /**
   * Execute an engine action (e.g. START or STOP) on a vehicle by its ID.
   *
   * @abstract
   * @param {string} id - The unique identifier of the vehicle.
   * @param {string} command - The engine command to execute (e.g. "START_VEHICLE" or "STOP_VEHICLE").
   * @returns {Promise<object>} A promise that resolves with the result of the engine command.
   * @throws {Error} If the method is not implemented by the subclass.
   */
  async actionEngine(id, command) {
    throw new Error('actionEngine not implemented');
  }
}
