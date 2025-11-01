import { QueriesDataService } from '../../types';

export type DocumentRTOQueriesKeys = 'get-form-rto';

export const documentRTOQueries: QueriesDataService<DocumentRTOQueriesKeys> = {
  'get-form-rto': 'submission-rto/:orderId',
};
