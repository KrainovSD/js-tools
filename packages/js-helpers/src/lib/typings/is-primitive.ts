export function isPrimitive(value: unknown): value is string | number | boolean | null | undefined {
  const type = typeof value;

  return value == undefined || (type != "object" && type != "function");
}
