import MMApiProvider from '../MMApi/MMApiProvider.js';

let providerInstance = null;

export function getCarApiProvider() {
  if (!providerInstance) {
    providerInstance = new MMApiProvider();
  }
  return providerInstance;
}

