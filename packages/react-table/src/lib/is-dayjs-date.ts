import { type DayJS, isObject } from "@krainovsd/js-helpers";

export function isDayjsDate(value: unknown): value is DayJS {
  return isObject(value) && "$isDayjsObject" in value;
}
