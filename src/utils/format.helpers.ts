/**
 * Formats a number using Czech locale (cs-CZ) formatting
 * @param value - The number to format
 * @param minDecimals - Minimum number of decimal places (default: 2)
 * @param maxDecimals - Maximum number of decimal places (default: 5)
 * @returns Formatted string representation of the number
 */
export const formatNumberCZ = (
  value: number,
  minDecimals = 2,
  maxDecimals = 5
): string => {
  return new Intl.NumberFormat("cs-CZ", {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(value);
};
