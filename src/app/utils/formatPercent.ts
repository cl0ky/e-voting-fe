export const formatValuePercent = (value: string) => {
  if (!value) return '';

  const numericValue = value.replace(/\D/g, '');

  if (numericValue.length === 0) return '';

  let formattedValue;
  if (numericValue.length === 1) {
    formattedValue = numericValue;
  } else {
    formattedValue = `${numericValue.slice(0, -2)}.${numericValue.slice(-2)}`;
  }

  return formattedValue.replace(/^0+/, '') || '0';
};
