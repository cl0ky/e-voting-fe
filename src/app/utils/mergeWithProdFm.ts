export const mergeWithStorageFm = (url: string) => {
  if (url.startsWith('https://')) {
    return url;
  }

  let baseUrl = process.env.NEXT_PUBLIC_FILE_MANAGER_URL_DEV ?? '';
  baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  return baseUrl + url;
};
