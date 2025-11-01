import { MutationDataService } from '../../types';

export type QuestionnaireMutationKeys = 'submit-questionnaire' | 'upload-file-questionnaire';

export const questionnaireMutationKeys: MutationDataService<QuestionnaireMutationKeys> = {
  'submit-questionnaire': {
    url: '/questionnaire/submit',
    method: 'POST',
    refetchQueries: [],
  },
  'upload-file-questionnaire': {
    url: '/questionnaire/submit-file',
    method: 'POST',
    refetchQueries: [],
  },
};
