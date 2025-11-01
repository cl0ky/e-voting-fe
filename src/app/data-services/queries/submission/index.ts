import { QueriesDataService } from '../../types';

export type SubmissionQueriesKeys = 'get-submission-data';

export const submissionQueries: QueriesDataService<SubmissionQueriesKeys> = {
  'get-submission-data': 'order/get-submission-data/:orderId',
};
