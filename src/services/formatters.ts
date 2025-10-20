export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    const millions = num / 1_000_000;
    return millions.toFixed(1) + 'M';
  }
  return num.toLocaleString('en-US');
}
