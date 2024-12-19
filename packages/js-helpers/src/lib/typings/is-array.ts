export function isArray(value: unknown): value is unknown[] {
  return Boolean(value && Array.isArray(value));
}
