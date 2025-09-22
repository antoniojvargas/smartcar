import axios from 'axios';
import BaseProvider from '../providers/BaseProvider.js';
import {
  transformVehicleInfoResponse,
  transformSecurityStatusResponse,
  transformEnergyResponse,
  transformEngineResponse,
} from './MMApiTransformers.js';
import { isSuccessResponse } from './MMApiValidators.js';

const BASE_URL = 'https://platform-challenge.smartcar.com/v1';

export default class MMApiProvider extends BaseProvider {
  async getVehicleInfo(id) {
    const { data: mmResponse } = await axios.post(
      `${BASE_URL}/getVehicleInfoService`,
      { id, responseType: 'JSON' },
    );

    if (!isSuccessResponse(mmResponse)) {
      return {
        status: mmResponse?.status ?? '500',
        reason: mmResponse?.reason ?? 'Unknown error from MM API',
      };
    }

    return { status: '200', data: transformVehicleInfoResponse(mmResponse) };
  }

  async getSecurityStatus(id) {
    const { data: mmResponse } = await axios.post(
      `${BASE_URL}/getSecurityStatusService`,
      { id, responseType: 'JSON' },
    );

    if (!isSuccessResponse(mmResponse)) {
      return {
        status: mmResponse?.status ?? '500',
        reason: mmResponse?.reason ?? 'Unknown error from MM API',
      };
    }

    return { status: '200', data: transformSecurityStatusResponse(mmResponse) };
  }

  async getEnergy(id) {
    const { data: mmResponse } = await axios.post(
      `${BASE_URL}/getEnergyService`,
      { id, responseType: 'JSON' },
    );

    if (!isSuccessResponse(mmResponse)) {
      return {
        status: mmResponse?.status ?? '500',
        reason: mmResponse?.reason ?? 'Unknown error from MM API',
      };
    }

    return { status: '200', data: transformEnergyResponse(mmResponse) };
  }

  async actionEngine(id, command) {
    const { data: mmResponse } = await axios.post(
      `${BASE_URL}/actionEngineService`,
      { id, command, responseType: 'JSON' },
    );

    if (!isSuccessResponse(mmResponse)) {
      return {
        status: mmResponse?.status ?? '500',
        reason: mmResponse?.reason ?? 'Unknown error from MM API',
      };
    }

    return { status: '200', data: transformEngineResponse(mmResponse) };
  }
}
