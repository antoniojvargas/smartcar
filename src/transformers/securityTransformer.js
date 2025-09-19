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
