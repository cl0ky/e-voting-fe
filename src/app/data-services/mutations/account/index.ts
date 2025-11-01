import { MutationDataService } from '../../types';

export type AccountMutationKeys =
  | 'update-phone-number'
  | 'generate-otp-email'
  | 'match-otp-email'
  | 'match-password'
  | 'update-password'
  | 'check-phone-number'
  | 'check-email'
  | 'update-profile-picture';

export const accountMutations: MutationDataService<AccountMutationKeys> = {
  'update-phone-number': {
    url: '/account/update-profile',
    method: 'PATCH',
    refetchQueries: ['get-user-by-id'],
  },
  'generate-otp-email': {
    url: '/account/generate-email',
    method: 'POST',
  },
  'match-otp-email': {
    url: '/account/match-otp',
    method: 'POST',
    refetchQueries: ['get-user-by-id'],
  },
  'match-password': {
    url: '/account/match-password',
    method: 'POST',
  },
  'update-password': {
    url: '/account/update-password',
    method: 'PUT',
  },
  'check-phone-number': {
    url: '/account/check-phone-number',
    method: 'POST',
  },
  'check-email': {
    url: '/account/check-email',
    method: 'POST',
  },
  'update-profile-picture': {
    url: '/account/update-avatar',
    method: 'PATCH',
    refetchQueries: ['get-user-by-id'],
  },
};
