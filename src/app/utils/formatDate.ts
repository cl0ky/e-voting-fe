export const formatTime = (date: string) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Baru saja'; // "just now" in Indonesian
  }

  return '';
};
