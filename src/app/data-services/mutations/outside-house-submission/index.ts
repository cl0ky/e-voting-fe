import { MutationDataService } from '../../types';

export type OutsideHouseMutationQueryKeys = 'outside-house-submission';

export const outsideHouseMutationKeys: MutationDataService<OutsideHouseMutationQueryKeys> = {
  'outside-house-submission': {
    url: '/outside-house-submission/create',
    method: 'POST',
    refetchQueries: ['get-home-proposal-list'],
  },
};
