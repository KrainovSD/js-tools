export function getDaysInYear(year: number) {
  return new Date(year, 1, 29).getMonth() == 1 ? 366 : 365;
}
