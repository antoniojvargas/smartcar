export function transformVehicleInfoResponse(mmResponse) {
  const data = mmResponse?.data || {};
  const vin = data.vin?.value || null;
  const color = data.color?.value || null;
  const driveTrain = data.driveTrain?.value || null;

  let doorCount = null;
  if (data.fourDoorSedan?.value === 'True') doorCount = 4;
  else if (data.twoDoorCoupe?.value === 'True') doorCount = 2;

  return { vin, color, doorCount, driveTrain };
}

export function transformSecurityStatusResponse(mmResponse) {
  const doors = mmResponse?.data?.doors?.values || [];
  return doors
    .map((door) => {
      const location = door?.location?.value;
      const lockedStr = door?.locked?.value;
      if (typeof location !== 'string' || typeof lockedStr !== 'string')
        return null;
      return { location, locked: lockedStr === 'True' };
    })
    .filter(Boolean);
}

export function transformEnergyResponse(mmResponse) {
  const tankLevel = mmResponse.data?.tankLevel;
  const batteryLevel = mmResponse.data?.batteryLevel;

  return {
    fuel:
      tankLevel?.type === 'Number' && tankLevel?.value
        ? parseFloat(tankLevel.value)
        : null,
    battery:
      batteryLevel?.type === 'Number' && batteryLevel?.value
        ? parseFloat(batteryLevel.value)
        : null,
  };
}

export function transformEngineResponse(mmResponse) {
  const result = mmResponse?.actionResult;
  if (!result || typeof result.status !== 'string') return null;

  const status = result.status.toUpperCase();
  if (status === 'EXECUTED') return { status: 'success' };
  if (status === 'FAILED') return { status: 'error' };
  return null;
}
