import { QueriesDataService } from '../../types';

export type UserQuestionnaireKeys = 'get-user-questionnaire';

export const questionnaireQueries: QueriesDataService<UserQuestionnaireKeys> = {
  'get-user-questionnaire': 'questionnaire/get-user-questionnaire',
};
