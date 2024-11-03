export function checkType<R>(value: unknown, condition: boolean): value is R {
  if (condition) {
    return true;
  }

  return false;
}
