import dayjs from "dayjs";
import { isDate } from "../typings";

export function dateFormat(date: Date | string | number, format: string) {
  const correctDate = new Date(date);

  if (!isDate(correctDate)) return "";

  return dayjs(correctDate).format(format);
}
