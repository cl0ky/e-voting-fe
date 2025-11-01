import { QueriesDataService } from '../../types';

export type OrderQueriesKeys =
  | 'get-home-list'
  | 'get-home-purchase-list'
  | 'get-detail-order'
  | 'get-nup-list'
  | 'get-detail-nup'
  | 'get-order-detail-payment'
  | 'get-list-order'
  | 'get-detail-order-nup'
  | 'get-cluster-by-id-ccaup'
  | 'get-bills-total';

export const orderQueries: QueriesDataService<OrderQueriesKeys> = {
  'get-home-list': 'order/get-home-list-user',
  'get-home-purchase-list': 'order/get-home-purchase-list',
  'get-detail-order': 'order/get-detail-order/:id',
  'get-nup-list': 'order/get-nup-list',
  'get-detail-nup': 'order/get-detail-nup/:id',
  'get-order-detail-payment': 'order/get-order-detail-payment/:orderId',
  'get-list-order': 'order/get-list-order',
  'get-detail-order-nup': 'order/get-detail-order-nup/:orderId',
  'get-cluster-by-id-ccaup': 'order/get-cluster/:ccaupId',
  'get-bills-total': 'order/get-bills-total',
};
