import * as Yup from 'yup';
import * as yup from 'yup';

import { isUploadedFile } from './isUploadedFile';

const isFileInstance = (value: unknown) => value instanceof File;
interface FileMeta {
  size: number;
  encoding: string;
  mimetype: string;
  fieldname: string;
  originalname: string;
}
export interface UploadedFile {
  url: string;
  meta: FileMeta;
  thumbnail: string | null;
  responsiveUrl: {
    small: string;
    medium: string;
    large: string;
  };
}
export const fileOrUploadedFileSchema = Yup.mixed<File | UploadedFile>().test(
  'file-or-uploaded-file',
  'Object must be either an UploadedFile or an instance of File',
  function (value) {
    if (value === null || value === undefined) return true;
    if (isUploadedFile(value)) {
      return true;
    } else if (isFileInstance(value)) {
      return true;
    }
    return false;
  },
);

export const filterItemSchema = yup.object().shape({
  label: yup.string().required(),
  value: yup.string().required(),
});
