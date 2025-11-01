import { MutationDataService } from '../../types';

export type NotificationMutationQueryKeys = 'create-notification' | 'mark-notification-as-read';

export const notificationMutationKeys: MutationDataService<NotificationMutationQueryKeys> = {
  'create-notification': {
    url: '/notifications',
    method: 'POST',
    refetchQueries: ['get-notifications', 'get-unread-notifications-count'],
  },
  'mark-notification-as-read': {
    url: '/notifications/read',
    method: 'PATCH',
    refetchQueries: ['get-notifications', 'get-unread-notifications-count'],
  },
};
