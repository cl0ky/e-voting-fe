import { MutationDataService } from '../../types';

export type OrderDocumentRTOMutationQueryKeys =
  | 'create-document-rto'
  | 'update-document-rto'
  | 'upload-file-submission-rto';

export const orderDocumentRTOMutationKeys: MutationDataService<OrderDocumentRTOMutationQueryKeys> =
  {
    'create-document-rto': {
      url: '/submission-rto/:orderId',
      method: 'POST',
    },
    'update-document-rto': {
      url: '/submission-rto/:orderId',
      method: 'PATCH',
    },
    'upload-file-submission-rto': {
      url: '/submission-rto/upload-file/:orderId',
      method: 'POST',
    },
  };
