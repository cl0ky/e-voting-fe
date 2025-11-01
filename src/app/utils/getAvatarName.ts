export const getAvatarName = (name: string) => {
  const nameSplit = name.split(' ');
  const result = nameSplit?.map((name) => name.charAt(0).toUpperCase()[0]);
  return result;
};
