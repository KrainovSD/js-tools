import dayjs from "dayjs";
import todayPlugin from "dayjs/plugin/isToday";
import type { Maybe } from "../../types";

dayjs.extend(todayPlugin);

export function isToday(date: Maybe<string | Date | number>) {
  try {
    return dayjs(date).isToday();
  } catch {
    return false;
  }
}
