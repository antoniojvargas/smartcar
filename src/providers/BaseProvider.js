export default class BaseProvider {
  async getVehicleInfo(id) {
    throw new Error('getVehicleInfo not implemented');
  }
  async getSecurityStatus(id) {
    throw new Error('getSecurityStatus not implemented');
  }
  async getEnergy(id) {
    throw new Error('getEnergy not implemented');
  }
  async actionEngine(id, command) {
    throw new Error('actionEngine not implemented');
  }
}
