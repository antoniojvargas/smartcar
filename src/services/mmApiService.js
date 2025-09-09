import axios from 'axios';

const BASE_URL = 'https://platform-challenge.smartcar.com/v1';

export async function getVehicleInfo(id) {
  const { data } = await axios.post(`${BASE_URL}/getVehicleInfoService`, {
    id,
    responseType: 'JSON',
  });
  return data;
}

export async function getSecurityStatusService(id) {
  const { data } = await axios.post(`${BASE_URL}/getSecurityStatusService`, {
    id,
    responseType: 'JSON',
  });
  return data;
}

export async function getEnergyService(id) {
  const { data } = await axios.post(`${BASE_URL}/getEnergyService`, {
    id,
    responseType: 'JSON',
  });
  return data;
}

export async function actionEngineService(id, command) {
  const { data } = await axios.post(`${BASE_URL}/actionEngineService`, {
    id,
    command,
    responseType: 'JSON',
  });
  return data;
}
