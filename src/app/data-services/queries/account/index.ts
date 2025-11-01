import { QueriesDataService } from '../../types';

export type AccountQueriesKeys = 'get-user-by-id' | 'get-otp-user' | 'check-empty-account';

export const accountQueries: QueriesDataService<AccountQueriesKeys> = {
  'get-user-by-id': 'account/get-user',
  'get-otp-user': 'account/get-otp-user',
  'check-empty-account': 'account/check-data-account-empty',
};
