import { QueriesDataService } from '../../types';

export type AuthQueriesKeys = 'get-user-verify' | 'get-user-register';

export const authQueries: QueriesDataService<AuthQueriesKeys> = {
  'get-user-verify': 'auth/get-user-verify/:userId',
  'get-user-register': 'auth/get-user-register/:id',
};
