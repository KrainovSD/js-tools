import dayjs from "dayjs";
import type { DateType } from "../../types";

export function dateDifference(
  type: DateType,
  firstDate: Date,
  secondDate: Date = new Date(),
  float: boolean = false,
) {
  const first = dayjs(firstDate);

  return first.diff(secondDate, type, float);
}
