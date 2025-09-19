export function isSuccessResponse(mmResponse) {
  return mmResponse && mmResponse.status === '200';
}
