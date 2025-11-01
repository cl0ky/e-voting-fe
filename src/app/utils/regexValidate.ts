export const isMinLength = (e: string): boolean => {
  return e.length >= 8;
};

export const hasLowerCase = (e: string): boolean => {
  return /[a-z]/.test(e);
};

export const hasUpperCase = (e: string): boolean => {
  return /[A-Z]/.test(e);
};

export const hasNumber = (e: string): boolean => {
  return /\d/.test(e);
};

export const isNumber = (e: string): boolean => {
  return /^[0-9]$/.test(e);
};

export const extractFirstNumberToRupiah = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '0';
  }
  try {
    const cleanedInput = input.replace(/[^\d\.,-<]/g, '').replace(/\./g, '');
    if (cleanedInput.includes('-')) {
      const [start, end] = cleanedInput.split('-').map((val) => val.trim());
      const numericStart = parseInt(start, 10);
      const numericEnd = parseInt(end, 10);
      if (isNaN(numericStart) || isNaN(numericEnd)) {
        return '0';
      }
      const halfStart = Math.floor(numericStart * 0.5) + (numericStart % 2);
      const halfEnd = Math.floor(numericEnd * 0.5) + (numericEnd % 2);
      return `Rp${halfStart.toLocaleString('id-ID')} - Rp${halfEnd.toLocaleString('id-ID')}`;
    }
    if (cleanedInput.includes('<')) {
      const numericValue = parseInt(cleanedInput.replace('<', '').trim(), 10);
      if (isNaN(numericValue)) {
        return '0';
      }
      const halfValue = Math.floor(numericValue * 0.5) + (numericValue % 2);
      return `Rp${halfValue.toLocaleString('id-ID')}`;
    }
    const numericStart = parseInt(cleanedInput, 10);
    if (isNaN(numericStart)) {
      return '0';
    }
    const halfValue = Math.floor(numericStart * 0.5) + (numericStart % 2);
    return `Rp${halfValue.toLocaleString('id-ID')}`;
  } catch (error) {
    console.error('Error in extractFirstNumber:', error);
    return '0';
  }
};
