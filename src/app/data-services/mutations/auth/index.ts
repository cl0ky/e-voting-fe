import { MutationDataService } from '../../types';

export type AuthMutationKeys =
  | 'register'
  | 'reset-password-request'
  | 'reset-password'
  | 'verify-account'
  | 'resend-otp';

export const authMutations: MutationDataService<AuthMutationKeys> = {
  register: {
    url: '/auth/register',
    method: 'POST',
    refetchQueries: [],
  },
  'verify-account': {
    url: '/auth/otp/match',
    method: 'POST',
    refetchQueries: [],
  },
  'resend-otp': {
    url: '/auth/otp/send',
    method: 'POST',
    refetchQueries: [],
  },
  'reset-password-request': {
    url: '/auth/reset-password',
    method: 'POST',
    refetchQueries: [],
  },
  'reset-password': {
    url: '/auth/reset-password/:token',
    method: 'PATCH',
    refetchQueries: [],
  },
};
