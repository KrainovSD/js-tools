export function type(value: unknown) {
  return value === null
    ? "Null"
    : value === undefined
      ? "Undefined"
      : Object.prototype.toString.call(value).slice(8, -1);
}
