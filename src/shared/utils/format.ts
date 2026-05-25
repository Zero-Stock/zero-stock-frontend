export function formatKg(value: number | null | undefined) {
  return value == null ? '-' : (value / 1000).toFixed(2);
}
