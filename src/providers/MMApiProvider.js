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
export default class MMApiProvider {
  /**
   * Retrieve basic vehicle information by its ID from the MM API.
   *
   * @override
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the vehicle information.
   */
  async getVehicleInfo(id) {
    const mmResponse = await getVehicleInfo(id);
    if (!mmResponse) return null;
    if (mmResponse.status !== '200') return { status: mmResponse.status };

    const data = mmResponse.data || {};
    const vin = data.vin?.value || null;
    const color = data.color?.value || null;
    const driveTrain = data.driveTrain?.value || null;

    let doorCount = null;
    if (data.fourDoorSedan?.value === 'True') doorCount = 4;
    else if (data.twoDoorCoupe?.value === 'True') doorCount = 2;

    return {
      status: '200',
      data: { vin, color, doorCount, driveTrain },
    };
  }

  /**
   * Retrieve the security status (e.g. door lock states) of a vehicle by its ID from the MM API.
   *
   * @override
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the security status of the vehicle.
   */
  async getSecurityStatus(id) {
    const mmResponse = await getSecurityStatusService(id);
    if (!mmResponse) return null;
    if (mmResponse.status !== '200') return { status: mmResponse.status };

    const data = mmResponse.data?.doors?.values;
    if (!Array.isArray(data)) return { status: '500', data: null };

    const doors = data
      .map((door) => {
        const location = door?.location?.value;
        const lockedStr = door?.locked?.value;
        if (typeof location !== 'string' || typeof lockedStr !== 'string') return null;
        return { location, locked: lockedStr === 'True' };
      })
      .filter(Boolean);

    return {
      status: '200',
      data: doors,
    };
  }

  /**
   * Retrieve the energy status (e.g. fuel or battery levels) of a vehicle by its ID from the MM API.
   *
   * @override
   * @param {string} id - The unique identifier of the vehicle.
   * @returns {Promise<object>} A promise that resolves with the energy status of the vehicle.
   */
  async getEnergy(id) {
    const mmResponse = await getEnergyService(id);
    if (!mmResponse) return null;
    if (mmResponse.status !== '200') return { status: mmResponse.status };

    const tankLevel = mmResponse.data?.tankLevel;
    const batteryLevel = mmResponse.data?.batteryLevel;

    return {
      status: '200',
      data: {
        fuel: tankLevel?.type === 'Number' && tankLevel?.value ? parseFloat(tankLevel.value) : null,
        battery: batteryLevel?.type === 'Number' && batteryLevel?.value ? parseFloat(batteryLevel.value) : null,
      },
    };
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
    const mmResponse = await actionEngineService(id, command);
    if (!mmResponse) return null;
    if (mmResponse.status !== '200') return { status: mmResponse.status };

    const result = mmResponse.actionResult;
    if (!result || typeof result.status !== 'string') return { status: '500', data: null };

    const status = result.status.toUpperCase();
    let responseData;
    if (status === 'EXECUTED') responseData = { status: 'success' };
    else if (status === 'FAILED') responseData = { status: 'error' };
    else responseData = null;

    return {
      status: '200',
      data: responseData,
    };
  }
}
