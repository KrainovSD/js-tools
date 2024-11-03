import dayjs from "dayjs";
import yesterdayPlugin from "dayjs/plugin/isYesterday";
import { type Maybe } from "../../types";

dayjs.extend(yesterdayPlugin);

export function isYesterday(date: Maybe<string | Date | number>) {
  try {
    return dayjs(date).isYesterday();
  } catch {
    return false;
  }
}
