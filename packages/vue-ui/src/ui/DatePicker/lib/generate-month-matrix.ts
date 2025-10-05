import type { DatePickerCell } from "../date-picker.types";
import { getMonthId } from "./get-month-id";

export function generateMonthMatrix(year: number, locale: string) {
  const matrix: DatePickerCell[][] = [];
  const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
  const now = new Date();
  const nowMonthId = getMonthId(now.getFullYear(), now.getMonth());

  let months: DatePickerCell[] = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(year, i);
    const monthId = getMonthId(year, i);
    months.push({
      id: monthId,
      today: nowMonthId === monthId,
      date,
      label: formatter.format(date),
      value: i,
      noTarget: false,
      weekend: false,
    });

    if (months.length === 3) {
      matrix.push(months);
      months = [];
    }
  }

  return matrix;
}
