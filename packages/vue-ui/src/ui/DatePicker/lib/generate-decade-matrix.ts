import type { DatePickerCell } from "../date-picker.types";

export function generateDecadeMatrix(century: number) {
  const matrix: DatePickerCell[][] = [];
  const now = new Date();
  const startYear = century * 100;
  const nowYear = now.getFullYear();

  const date = new Date(startYear * 10);
  let years: DatePickerCell[] = [];
  for (let i = -1; i < 11; i++) {
    const year = startYear + i * 10;

    years.push({
      id: year,
      today: year <= nowYear && nowYear <= year + 9,
      date,
      label: `${year.toString()}-${(year + 9).toString()}`,
      value: year / 10,
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
