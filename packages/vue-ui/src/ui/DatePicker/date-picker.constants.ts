import type { DatePickerDisplayFormat, DatePickerView } from "./date-picker.types";

export const DATE_PICKER_OUTPUT_FORMAT = "YYYY-MM-DD";
export const WEEK_DAY_DATE_MAP = [
  new Date("2026-01-04T00:00:00.000Z").getTime(),
  new Date("2026-01-05T00:00:00.000Z").getTime(),
  new Date("2026-01-06T00:00:00.000Z").getTime(),
  new Date("2026-01-07T00:00:00.000Z").getTime(),
  new Date("2026-01-08T00:00:00.000Z").getTime(),
  new Date("2026-01-09T00:00:00.000Z").getTime(),
  new Date("2026-01-10T00:00:00.000Z").getTime(),
];
export const DISPLAY_FORMATS: Record<DatePickerView, Record<DatePickerDisplayFormat, string>> = {
  days: { iso: "YYYY-MM-DD", "ru-dot": "DD.MM.YYYY", "ru-slash": "DD/MM/YYYY" },
  months: { iso: "YYYY-MM", "ru-dot": "MM.YYYY", "ru-slash": "MM/YYYY" },
  years: { iso: "YYYY", "ru-dot": "YYYY", "ru-slash": "YYYY" },
};
