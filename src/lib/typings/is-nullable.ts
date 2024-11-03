export function isNullable(value: unknown): value is null | undefined {
  return typeof value === "undefined" || value === null;
}
