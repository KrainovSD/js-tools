import dayjs from "dayjs";
import tomorrowPlugin from "dayjs/plugin/isTomorrow";
import type { Maybe } from "../../types";

dayjs.extend(tomorrowPlugin);

export function isTomorrow(date: Maybe<string | Date | number>) {
  try {
    return dayjs(date).isTomorrow();
  } catch {
    return false;
  }
}
