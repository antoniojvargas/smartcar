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
