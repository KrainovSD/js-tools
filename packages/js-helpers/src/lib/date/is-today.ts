import type { Maybe } from "../../types";

export function isToday(date: Maybe<string | Date | number>) {
  if (date == undefined) return false;

  try {
    const checkedDate = new Date(date);
    const now = new Date();

    return (
      ((checkedDate.getFullYear() << 16) |
        (checkedDate.getMonth() << 8) |
        checkedDate.getDate()) ===
      ((now.getFullYear() << 16) | (now.getMonth() << 8) | now.getDate())
    );
  } catch {
    return false;
  }
}
