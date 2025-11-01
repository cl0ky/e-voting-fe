import { QueriesDataService } from '../../types';

export type RegionsQueriesKeys = 'get-regions' | 'get-region';

export const regionsQueries: QueriesDataService<RegionsQueriesKeys> = {
  'get-regions': 'regions/get-regions',
  'get-region': 'regions/get-region',
};
