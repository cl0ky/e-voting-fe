import { MutationDataService } from '../../types';

export type SurveyAppointmentMutationQueryKeys =
  | 'create-survey-appointment'
  | 'update-survey-appointment'
  | 'cancel-survey-appointment';

export const surveyAppointmentMutationKeys: MutationDataService<SurveyAppointmentMutationQueryKeys> =
  {
    'create-survey-appointment': {
      url: '/survey-appointment',
      method: 'POST',
      refetchQueries: ['get-survey-appointments', 'get-survey-appointment'],
    },
    'update-survey-appointment': {
      url: '/survey-appointment/:surveyId',
      method: 'PATCH',
      refetchQueries: ['get-survey-appointments', 'get-survey-appointment'],
    },
    'cancel-survey-appointment': {
      url: '/survey-appointment/cancel/:surveyId',
      method: 'PATCH',
      refetchQueries: ['get-survey-appointments', 'get-survey-appointment'],
    },
  };
