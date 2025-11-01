import { QueriesDataService } from '../../types';

export type ProjectQueriesKeys = 'get-project-highlight' | 'get-project-detail';

export const projectQueries: QueriesDataService<ProjectQueriesKeys> = {
  'get-project-highlight': 'project/highlights',
  'get-project-detail': 'project/:projectId',
};
