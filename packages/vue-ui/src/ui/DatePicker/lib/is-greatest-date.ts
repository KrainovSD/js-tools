import { getDateId } from "./get-date-id";

export function isGreatestDate(date: string | number | Date, compareDate: string | number | Date) {
  const firstDate = new Date(date);
  const secondDate = new Date(compareDate);

  return (
    getDateId(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate()) >
    getDateId(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate())
  );
}
