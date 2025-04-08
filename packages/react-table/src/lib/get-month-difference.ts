export function getMonthDifference(dateStart: Date, dateEnd: Date) {
  const yearDiff = dateEnd.getFullYear() - dateStart.getFullYear();
  const monthDiff = dateEnd.getMonth() - dateStart.getMonth();

  return yearDiff * 12 + monthDiff;
}
