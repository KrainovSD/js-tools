export function isEmptyObject(obj: Record<string, unknown>) {
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      return false;
    }
  }
  return true;
}
