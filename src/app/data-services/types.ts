import { AllQueriesKeys } from './queries';

export type MutationDataService<T extends string> = {
  [key in T]: {
    url: string;
    method: 'POST' | 'PATCH' | 'DELETE' | 'PUT';
    refetchQueries?: AllQueriesKeys[];
  };
};
export type QueriesDataService<T extends string> = {
  [key in T]: string;
};
