export function isDate(value: unknown): value is Date {
  if (value instanceof Date) return !Number.isNaN(value.valueOf());

  return false;
}
