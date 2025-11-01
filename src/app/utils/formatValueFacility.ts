export const formatValueFacility = (value: string | number | undefined) => {
  return value === '' || value === '0' || value === null || value === 0 ? '-' : value;
};
