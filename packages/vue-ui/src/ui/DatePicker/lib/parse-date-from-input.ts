import { dateFormat } from "@krainovsd/js-helpers";
import { DATE_PICKER_OUTPUT_FORMAT } from "../date-picker.constants";
import type { DatePickerDisplayFormat, DatePickerView } from "../date-picker.types";

export function parseDateFromInput(
  value: string | undefined,
  outputFormat: string,
  view: DatePickerView,
  format: DatePickerDisplayFormat,
) {
  if (
    value != undefined &&
    ((view === "days" && value.length === 10) ||
      (view === "months" && value.length === 7) ||
      (view === "years" && value?.length === 4))
  ) {
    let day = "0";
    let month = "1";
    let year = "0";
    let splittedValue: string[] = [];

    if (format === "ru-dot") {
      splittedValue = value.split(".");
      if (view === "days") {
        [day, month, year] = splittedValue;
      } else if (view === "months") {
        [month, year] = splittedValue;
      } else if (view === "years") {
        [year] = splittedValue;
      }
    } else if (format === "ru-slash") {
      splittedValue = value.split("/");
      if (view === "days") {
        [day, month, year] = splittedValue;
      } else if (view === "months") {
        [month, year] = splittedValue;
      } else if (view === "years") {
        [year] = splittedValue;
      }
    } else if (format === "iso") {
      splittedValue = value.split("-");
      if (view === "days") {
        [year, month, day] = splittedValue;
      } else if (view === "months") {
        [year, month] = splittedValue;
      } else if (view === "years") {
        [year] = splittedValue;
      }
    }

    const dayNumber = +day;
    const monthNumber = +month;
    const yearNumber = +year;
    if (
      Number.isNaN(dayNumber) ||
      Number.isNaN(monthNumber) ||
      Number.isNaN(yearNumber) ||
      monthNumber - 1 < 0
    ) {
      return null;
    }
    const lastDayMonth = new Date(yearNumber, monthNumber, 0).getDate();
    if (lastDayMonth < dayNumber) {
      return null;
    }

    const date = new Date(yearNumber, monthNumber - 1, dayNumber);
    if (!isNaN(date.getTime())) {
      return dateFormat(date, outputFormat ?? DATE_PICKER_OUTPUT_FORMAT);
    }

    return null;
  }

  return null;
}
