import { QueriesDataService } from '../../types';

export type NotificationQueryKeys = 'get-notifications' | 'get-unread-notifications-count';

export const notificationQueries: QueriesDataService<NotificationQueryKeys> = {
  'get-notifications': 'notifications',
  'get-unread-notifications-count': 'notifications/unread',
};
