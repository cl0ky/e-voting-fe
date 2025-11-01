import { MutationDataService } from '../types';
import { AccountMutationKeys, accountMutations } from './account';
import { AuthMutationKeys, authMutations } from './auth';
import { OrderDocumentRTOMutationQueryKeys, orderDocumentRTOMutationKeys } from './documents-rto';
import { NotificationMutationQueryKeys, notificationMutationKeys } from './notification';
import { OrderMutationKeys, orderMutationKeys } from './order';
import {
  OutsideHouseMutationQueryKeys,
  outsideHouseMutationKeys,
} from './outside-house-submission';
import { QuestionnaireMutationKeys, questionnaireMutationKeys } from './questionnaire';
import { RegionsMutationKeys, regionsMutationKeys } from './regions';
import {
  SurveyAppointmentMutationQueryKeys,
  surveyAppointmentMutationKeys,
} from './survey-appointment';

export type AllMutationKeys =
  | AuthMutationKeys
  | QuestionnaireMutationKeys
  | OrderMutationKeys
  | AccountMutationKeys
  | RegionsMutationKeys
  | SurveyAppointmentMutationQueryKeys
  | NotificationMutationQueryKeys
  | OutsideHouseMutationQueryKeys
  | OrderDocumentRTOMutationQueryKeys;

export const allMutations: MutationDataService<AllMutationKeys> = {
  ...authMutations,
  ...questionnaireMutationKeys,
  ...orderMutationKeys,
  ...accountMutations,
  ...regionsMutationKeys,
  ...surveyAppointmentMutationKeys,
  ...notificationMutationKeys,
  ...outsideHouseMutationKeys,
  ...orderDocumentRTOMutationKeys,
};
