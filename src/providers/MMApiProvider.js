import CarApiProvider from './CarApiProvider.js';
import {
  getVehicleInfo,
  getSecurityStatusService,
  getEnergyService,
  actionEngineService,
} from '../services/mmApiService.js';

export default class MMApiProvider extends CarApiProvider {
  async getVehicleInfo(id) {
    return await getVehicleInfo(id);
  }
  async getSecurityStatus(id) {
    return await getSecurityStatusService(id);
  }
  async getEnergy(id) {
    return await getEnergyService(id);
  }
  async actionEngine(id, command) {
    return await actionEngineService(id, command);
  }
}