import { useCallback, useEffect } from 'react';

import { SnackBarResultController } from '@amani-group-id/toolkit';
import {
  DefinedInitialDataInfiniteOptions,
  InfiniteData,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

import { AllQueriesKeys, allQueries } from '@/src/app/data-services/queries';
import { AxiosErrorResponse, Data } from '@/src/app/types';
import { constructUrl } from '@/src/app/utils/constructUrl';

import useAxiosWithAuth from '../../use-axios-with-auth';
import useAxiosWithoutAuth from '../../use-axios-without-auth';
import { InfiniteList } from './types';

export interface useInfiniteApiRequest<T extends Data<T> & InfiniteList<T>> {
  key: AllQueriesKeys;
  config?: {
    params?: { [key: string]: string };
    query?: { [key: string]: unknown };
  };
  options?: Partial<
    UseInfiniteQueryOptions<T, AxiosErrorResponse> & Pick<AxiosRequestConfig, 'params'>
  >;
  needAuth?: boolean;
}

function useInfiniteApiRequest<T extends Data<T> & InfiniteList<T>>({
  key,
  options,
  config,
  needAuth = true,
}: useInfiniteApiRequest<T>) {
  const url = allQueries[key as keyof typeof allQueries];

  const queryClient = useQueryClient();
  const replacedUrl = constructUrl(url, config);

  const axiosWithAuth = useAxiosWithAuth();
  const axiosWithoutAuth = useAxiosWithoutAuth();
  const axiosFetch = needAuth ? axiosWithAuth : axiosWithoutAuth;

  const fetchData: QueryFunction<InfiniteList<Data<T>>, QueryKey, unknown> = useCallback(
    async ({ pageParam = 1 }: { pageParam: unknown }) => {
      const page =
        typeof pageParam === 'object' && pageParam !== null && 'page' in pageParam
          ? (pageParam as { page: number }).page
          : (pageParam as number);

      const response = await axiosFetch({
        method: 'GET',
        url: replacedUrl,
        params: {
          ...config?.params,
          ...config?.query,
          page,
        },
      });

      if (!response) return;
      if (response.data.message) return response.data.data;
      return response.data;
    },
    [replacedUrl, axiosFetch, config?.query, config?.params],
  );

  const queryOptions = {
    // initialData: {
    //   pages: [],
    //   pageParams: [1],
    // },
    initialPageParam: 1,
    queryKey: [key, url, config],
    queryFn: fetchData,
    retry: 1,
    getNextPageParam: (lastPage: Data<T> & InfiniteList<T>) => {
      const _lastpage = lastPage;
      if (_lastpage) {
        if (_lastpage.next) {
          return { next: _lastpage.next };
        } else if (_lastpage.page * _lastpage.perPage < _lastpage.totalItems) {
          return { page: _lastpage.page + 1 };
        } else {
          return undefined;
        }
      }
    },
    ...options,
  };

  const queryFetch = useInfiniteQuery<T, AxiosErrorResponse>(
    queryOptions as DefinedInitialDataInfiniteOptions<
      T,
      AxiosErrorResponse,
      InfiniteData<T>,
      QueryKey,
      unknown
    >,
  );

  useEffect(() => {
    if (queryFetch.isError && queryFetch.error) {
      SnackBarResultController.open({
        content: queryFetch.error.message,
        variant: 'error',
      });
    }
  }, [queryFetch.isError, queryFetch.error, queryClient]);

  return queryFetch;
}

export default useInfiniteApiRequest;
