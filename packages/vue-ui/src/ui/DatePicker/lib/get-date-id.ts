export function getDateId(year: number, month: number, day: number) {
  return (year << 16) | (month << 8) | day;
}
