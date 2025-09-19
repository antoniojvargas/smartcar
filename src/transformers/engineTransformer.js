export function transformEngineResponse(mmResponse) {
  const result = mmResponse?.actionResult;
  if (!result || typeof result.status !== 'string') return null;

  const status = result.status.toUpperCase();
  if (status === 'EXECUTED') return { status: 'success' };
  if (status === 'FAILED') return { status: 'error' };
  return null;
}
