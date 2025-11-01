import { PropertyQueriesKeys, propertyQueries } from '@/src/app/data-services/queries/property';

import { QueriesDataService } from '../types';
import { AccountQueriesKeys, accountQueries } from './account';
import { AuthQueriesKeys, authQueries } from './auth';
import { DocumentRTOQueriesKeys, documentRTOQueries } from './documents-rto';
import { NotificationQueryKeys, notificationQueries } from './notification';
import { OrderQueriesKeys, orderQueries } from './order';
import { OutsideHouseKeys, outsideHouseQueries } from './outside-house-submission';
import { ProjectQueriesKeys, projectQueries } from './project';
import { UserQuestionnaireKeys, questionnaireQueries } from './questionnaire';
import { RegionsQueriesKeys, regionsQueries } from './regions';
import { SubmissionQueriesKeys, submissionQueries } from './submission';
import { SurveyAppoinmentQueryKeys, surveyAppointmentQueries } from './survey-appointment';

export type AllQueriesKeys =
  | AuthQueriesKeys
  | AccountQueriesKeys
  | UserQuestionnaireKeys
  | OrderQueriesKeys
  | PropertyQueriesKeys
  | ProjectQueriesKeys
  | RegionsQueriesKeys
  | SubmissionQueriesKeys
  | SurveyAppoinmentQueryKeys
  | NotificationQueryKeys
  | OutsideHouseKeys
  | DocumentRTOQueriesKeys;

export const allQueries: QueriesDataService<AllQueriesKeys> = {
  ...authQueries,
  ...questionnaireQueries,
  ...accountQueries,
  ...orderQueries,
  ...propertyQueries,
  ...projectQueries,
  ...regionsQueries,
  ...submissionQueries,
  ...surveyAppointmentQueries,
  ...notificationQueries,
  ...outsideHouseQueries,
  ...documentRTOQueries,
};
