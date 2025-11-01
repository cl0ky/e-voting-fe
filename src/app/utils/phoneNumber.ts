/**
 * Formats a phone number to the desired format: +62XXXX-XXXX-XXXX
 *
 * @param input - The original phone number string (e.g., "123-4")
 * @returns The formatted phone number (e.g., "+621234")
 */
export const formatPhoneNumberBuyer = (input: string): string => {
  // Step 1: Remove all non-digit characters
  const digits = input.replace(/\D/g, '');

  // Step 2: Prefix with '+62'
  const prefixed = `+62${digits}`;

  // Step 3: Extract the numeric part after '+62' for grouping
  const numberPart = prefixed.slice(3); // Removes '+62'

  // Step 4: Split the number part into groups of up to 4 digits
  const groups = numberPart.match(/.{1,4}/g);

  // Step 5: Combine the prefix with the grouped numbers
  if (groups) {
    return `+62${groups.join('-')}`;
  } else {
    return prefixed; // In case there are no digits after '+62'
  }
};
