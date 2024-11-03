import { isString } from "../typings";

export function transformToNumber(value: unknown) {
  let result: number | undefined;

  if (isString(value)) result = parseInt(value, 10);
  else result = Number(value);

  return Number.isNaN(result) ? 0 : result;
}
