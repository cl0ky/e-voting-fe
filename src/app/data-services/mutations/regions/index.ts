import { MutationDataService } from '../../types';

export type RegionsMutationKeys = 'get-region';

export const regionsMutationKeys: MutationDataService<RegionsMutationKeys> = {
  'get-region': {
    url: '/regions/get-region',
    method: 'POST',
  },
};
