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
