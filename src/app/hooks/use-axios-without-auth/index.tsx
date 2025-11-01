import { useCallback } from 'react';

import { AxiosError, AxiosRequestConfig } from 'axios';
import { usePathname } from 'next/navigation';

import { SuccessResponse } from '@/src/app/types';
import { axiosWithoutAuth } from '@/src/app/utils/axiosWithoutAuth';

import { ResponsePayload } from './types';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function useAxiosWithoutAuth<T = any>() {
  const asPath = usePathname();
  const axiosFetch = useCallback(
    async (config: AxiosRequestConfig) => {
      if (!axiosWithoutAuth.defaults.baseURL) throw { message: 'base url required' };
      axiosWithoutAuth.defaults.headers.common['clientPath'] = asPath;
      if (!config.url) return;
      if (config.url.match(/undefined/g)) return;

      return await axiosWithoutAuth<SuccessResponse<T>>(config).catch(
        async (err: AxiosError<ResponsePayload>) => {
          if (![401].includes(err.response?.status || 0)) throw err;
        },
      );
    },
    [asPath],
  );

  return axiosFetch;
}

export default useAxiosWithoutAuth;
