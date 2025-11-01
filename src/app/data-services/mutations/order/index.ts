import { MutationDataService } from '../../types';

export type OrderMutationKeys = 'upload-file-order' | 'submit-home-proposal' | 'order-nup';

export const orderMutationKeys: MutationDataService<OrderMutationKeys> = {
  'upload-file-order': {
    url: '/order/upload',
    method: 'POST',
    refetchQueries: [],
  },
  'submit-home-proposal': {
    url: '/order/submit-home-proposal',
    method: 'POST',
    refetchQueries: [],
  },
  'order-nup': {
    url: '/order/nup',
    method: 'POST',
    refetchQueries: ['get-list-order'],
  },
};
