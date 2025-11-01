'use client';

import { useCallback } from 'react';

import { AxiosError, AxiosRequestConfig } from 'axios';
import { usePathname } from 'next/navigation';

import { SuccessResponse } from '@/src/app/types';
import axiosWithAuth from '@/src/app/utils/axiosWithAuth';

import { useAuth } from '../use-auth';
import { ResponsePayload } from './types';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function useAxiosWithAuth<T = any>() {
  const { signOut } = useAuth();
  const asPath = usePathname();
  const axiosFetch = useCallback(
    async (config: AxiosRequestConfig) => {
      if (!axiosWithAuth.defaults.baseURL) throw { message: 'base url required' };
      axiosWithAuth.defaults.headers.common['clientPath'] = asPath;
      if (!config.url) return;
      if (config.url.match(/undefined/g)) return;

      return await axiosWithAuth<SuccessResponse<T>>(config).catch(
        async (err: AxiosError<ResponsePayload>) => {
          if (![401].includes(err.response?.status || 0)) throw err;
          await signOut();
        },
      );
    },
    [signOut, asPath],
  );

  return axiosFetch;
}

export default useAxiosWithAuth;
