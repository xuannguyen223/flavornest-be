export function convertFractionToDecimal(fraction: string): number {
  const [numerator, denominator] = fraction.split("/").map(Number);
  if (numerator && denominator) return numerator / denominator;
  if (numerator) return numerator;
  if (denominator) return 1 / denominator;
  return 1;
}
