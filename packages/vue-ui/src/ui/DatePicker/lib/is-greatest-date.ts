import { getDayId } from "./get-day-id";

export function isGreatestDate(date: string | number | Date, compareDate: string | number | Date) {
  const firstDate = new Date(date);
  const secondDate = new Date(compareDate);

  return (
    getDayId(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate()) >
    getDayId(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate())
  );
}
