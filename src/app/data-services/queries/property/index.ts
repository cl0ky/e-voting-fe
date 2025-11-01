import { QueriesDataService } from '../../types';

export type PropertyQueriesKeys =
  | 'get-property-recommendation'
  | 'get-last-seen-property'
  | 'get-unit-by-cluster'
  | 'pricelist-calculator'
  | 'get-property-detail'
  | 'completion-status'
  | 'get-last-search';

export const propertyQueries: QueriesDataService<PropertyQueriesKeys> = {
  'get-property-recommendation': 'property/recommendation',
  'get-property-detail': 'property/get-property-detail/:id',
  'get-last-seen-property': 'property/last-seen-property',
  'get-unit-by-cluster': 'property/get-unit/:homeDesignId/:clusterId',
  'pricelist-calculator': 'property/pricelist-calculator',
  'completion-status': 'property/completion-status',
  'get-last-search': 'property/last-search',
};
