export function getMonthId(year: number, month: number) {
  return (year << 16) | month;
}
