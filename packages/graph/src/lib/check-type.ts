export function checkType<T>(value: unknown, condition: boolean): value is T {
  return condition;
}
