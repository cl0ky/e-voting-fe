import { UploadedFile } from './yupFile';

export function isUploadedFile(file: File | UploadedFile): file is UploadedFile {
  if (file) {
    return 'url' in file;
    // return 'url' in file && 'thumbnail' in file;
  }
  return false;
}
