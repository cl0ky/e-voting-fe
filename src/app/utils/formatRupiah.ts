// src/utils/formatCurrency.ts

/**
 * Formats a number into Indonesian Rupiah (IDR) currency format.
 *
 * @param amount - The numeric value to format.
 * @param locale - (Optional) The locale string. Defaults to 'id-ID'.
 * @param currency - (Optional) The currency code. Defaults to 'IDR'.
 * @returns A string representing the formatted currency.
 */
export const formatRupiah = (
  amount: number,
  locale: string = 'id-ID',
  currency: string = 'IDR',
): string => {
  if (isNaN(amount)) {
    console.warn(`formatRupiah: Provided amount '${amount}' is not a number.`);
    return 'Rp0';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0, // Remove decimal places for whole number formatting
    maximumFractionDigits: 0, // Ensure no decimal places
  }).format(amount);
};
