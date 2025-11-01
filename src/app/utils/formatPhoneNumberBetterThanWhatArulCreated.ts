export const formatPhoneNumberBetterThanWhatArulCreated = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');

  const firstGroup = cleaned.slice(0, 3);
  const secondGroup = cleaned.slice(3, 7);
  const thirdGroup = cleaned.slice(7);

  let formatted = firstGroup;
  if (secondGroup) formatted += `-${secondGroup}`;
  if (thirdGroup) formatted += `-${thirdGroup}`;

  return formatted;
};
