export const mergeWithStorageUrl = (url: string) => {
  let baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? '';
  baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  return baseUrl + url;
};
