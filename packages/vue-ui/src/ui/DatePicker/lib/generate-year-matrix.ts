import type { DatePickerCell } from "../date-picker.types";

export function generateYearMatrix(decade: number) {
  const matrix: DatePickerCell[][] = [];
  const now = new Date();
  const startYear = decade * 10;
  const nowYear = now.getFullYear();

  let years: DatePickerCell[] = [];
  for (let i = -1; i < 11; i++) {
    const year = startYear + i;
    const date = new Date(year, 0);
    years.push({
      id: year,
      today: nowYear === year,
      date,
      label: year.toString(),
      value: year,
      noTarget: i === -1 || i === 10,
      weekend: false,
    });

    if (years.length === 3) {
      matrix.push(years);
      years = [];
    }
  }

  return matrix;
}
