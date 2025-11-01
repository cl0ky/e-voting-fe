import { QueriesDataService } from '../../types';

export type SurveyAppoinmentQueryKeys = 'get-survey-appointments' | 'get-survey-appointment';

export const surveyAppointmentQueries: QueriesDataService<SurveyAppoinmentQueryKeys> = {
  'get-survey-appointments': 'survey-appointment',
  'get-survey-appointment': 'survey-appointment/survey',
};
