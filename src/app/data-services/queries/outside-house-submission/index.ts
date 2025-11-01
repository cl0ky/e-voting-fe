import { QueriesDataService } from '../../types';

export type OutsideHouseKeys = 'get-home-proposal-list' | 'get-detail-image-outside-house';

export const outsideHouseQueries: QueriesDataService<OutsideHouseKeys> = {
  'get-home-proposal-list': 'outside-house-submission/get-home-proposal-list',
  'get-detail-image-outside-house':
    'outside-house-submission/get-detail-image-outside-house/:outsideHouseId',
};
