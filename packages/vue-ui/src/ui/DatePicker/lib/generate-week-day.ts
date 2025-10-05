import { WEEK_DAY_DATE_MAP } from "../date-picker.constants";
import type { DatePickerWeekDay } from "../date-picker.types";

export function generateWeekDay(startWeek: number, locale: string) {
  const daysOfWeek: DatePickerWeekDay[] = [];
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  let currentDateWeek = startWeek;
  let cursor = 0;

  formatter.format();

  while (cursor < 7) {
    daysOfWeek.push({
      label: formatter.format(WEEK_DAY_DATE_MAP[currentDateWeek]),
      value: currentDateWeek,
      weekend: currentDateWeek === 0 || currentDateWeek === 6,
    });
    cursor++;
    if (currentDateWeek < 6) {
      currentDateWeek++;
    } else {
      currentDateWeek = 0;
    }
  }

  return daysOfWeek;
}
