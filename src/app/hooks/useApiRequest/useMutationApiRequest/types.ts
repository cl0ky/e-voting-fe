import { UseMutationOptions } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

import { AllMutationKeys } from '@/src/app/data-services/mutations';
import { AxiosErrorResponse } from '@/src/app/types';

export interface UseMuationApiRequestProps<T> {
  key: AllMutationKeys;
  data?: unknown;
  config?: {
    params?: { [key: string]: string };
    query?: { [key: string]: string };
  };
  options?: UseMutationOptions<{ data: T; message: string }, AxiosErrorResponse, unknown> & {
    query?: AxiosRequestConfig['params'];
  };
  needAuth?: boolean;
}
