import dayjs, { type Dayjs } from "dayjs";

export function transformToDayjs(date: Date | string | number): Dayjs {
  return dayjs(date);
}
