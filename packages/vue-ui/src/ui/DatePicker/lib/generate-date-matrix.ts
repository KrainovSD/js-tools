import { isToday } from "@krainovsd/js-helpers";
import type { DatePickerCell } from "../date-picker.types";
import { getDayId } from "./get-day-id";

export function generateDateMatrix(year: number, month: number, startWeek: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const matrix: DatePickerCell[][] = [];
  let week: DatePickerCell[] = [];

  let firstDayWeek = firstDay.getDay();
  firstDayWeek = firstDayWeek === 0 ? startWeek : firstDayWeek - startWeek;
  firstDayWeek = firstDayWeek < 0 ? 7 + firstDayWeek : firstDayWeek;

  const lastDayPrevMonth = new Date(year, month, 0).getDate() - firstDayWeek + 1;
  let prevMonthDay = lastDayPrevMonth;
  /** prev month */
  while (week.length < firstDayWeek) {
    const cornerOfYear = month - 1 < 0;
    const currentMonth = cornerOfYear ? 11 : month - 1;
    const currentYear = cornerOfYear ? year - 1 : year;
    const currentDate = new Date(currentYear, currentMonth, prevMonthDay);
    const weekDay = currentDate.getDay();

    week.push({
      id: getDayId(currentYear, currentMonth, prevMonthDay),
      noTarget: true,
      date: currentDate,
      label: prevMonthDay.toString(),
      today: isToday(currentDate),
      value: prevMonthDay,
      weekend: weekDay === 0 || weekDay === 6,
    });
    prevMonthDay++;
  }

  /** current month */
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const weekDay = currentDate.getDay();

    week.push({
      id: getDayId(year, month, day),
      noTarget: false,
      date: currentDate,
      label: day.toString(),
      today: isToday(currentDate),
      value: day,
      weekend: weekDay === 0 || weekDay === 6,
    });

    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  /** next month */
  if (week.length > 0) {
    let nextMonthDay = 1;

    while (week.length < 7) {
      const cornerOfYear = month + 1 > 11;
      const currentMonth = cornerOfYear ? 0 : month + 1;
      const currentYear = cornerOfYear ? year + 1 : year;
      const currentDate = new Date(currentYear, currentMonth, nextMonthDay);
      const weekDay = currentDate.getDay();

      week.push({
        id: getDayId(currentYear, currentMonth, nextMonthDay),
        noTarget: true,
        date: currentDate,
        label: nextMonthDay.toString(),
        today: isToday(currentDate),
        value: nextMonthDay,
        weekend: weekDay === 0 || weekDay === 6,
      });
      nextMonthDay++;
    }
    matrix.push(week);
  }

  return matrix;
}
