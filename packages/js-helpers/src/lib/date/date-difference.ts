import dayjs from "dayjs";
import type { DateType } from "../../types";

type DateDifference = {
  type: DateType;
  firstDate: Date;
  secondDate?: Date;
  float?: boolean;
};

export function dateDifference({
  firstDate,
  float = false,
  secondDate = new Date(),
  type,
}: DateDifference) {
  const first = dayjs(firstDate);

  return first.diff(secondDate, type, float);
}
