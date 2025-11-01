'use client';

import { useMemo } from 'react';

import useQueryApiRequest from '../useApiRequest/useQueryApiRequest';

export interface Regions {
  code: string;
  name: string;
  postal_code?: string;
}

const useRegions = (forPostalCode?: boolean, queryParams?: Record<string, string>) => {
  const { data, isLoading, isError } = useQueryApiRequest<Regions[]>({
    key: 'get-regions',
    config: { query: queryParams },
  });
  const dataFetched = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    if (forPostalCode) {
      return data.map((region) => ({
        label: region.name || 'Tidak ada',
        value: region.postal_code || 'Tidak ada',
      }));
    }
    return data.map((region) => ({
      label: region.name,
      value: region.code,
    }));
  }, [data, forPostalCode]);

  return {
    dataFetched,
    isLoading,
    isError,
  };
};

export default useRegions;
