import { isArray, isDate, isId, transformToDayjs } from "@krainovsd/js-helpers";
import type { Row as TableRow } from "@tanstack/react-table";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import type { DefaultRow } from "../../../types";
import { isDayjsDate } from "./is-dayjs-date";
import { getData } from "./lodash";

dayjs.extend(isBetween);

export function dateFilter<Row extends DefaultRow>(
  row: TableRow<Row>,
  columnId: string,
  filterValue: unknown,
): boolean {
  if (!isDayjsDate(filterValue)) return true;

  const value = getData(row.original, columnId);
  if (!isDate(value) && !isId(value)) return true;

  return filterValue.isSame(value, "day");
}

export function dateRangeFilter<Row extends DefaultRow>(
  row: TableRow<Row>,
  columnId: string,
  filterValue: unknown,
): boolean {
  if (!isArray(filterValue) || !isDayjsDate(filterValue[0]) || !isDayjsDate(filterValue[1]))
    return true;

  const value = getData(row.original, columnId);

  if (!isDate(value) && !isId(value)) return true;

  const currentDate = transformToDayjs(value);

  return currentDate.isBetween(filterValue[0], filterValue[1], "day", "[]");
}

export function stringByArrayFilter<Row extends DefaultRow>(
  row: TableRow<Row>,
  columnId: string,
  filterValue: unknown,
): boolean {
  if (!isArray(filterValue) || filterValue.length === 0) return true;

  const value = getData(row.original, columnId);
  if (!isId(value)) return true;

  return filterValue.some((filter) => filter === value);
}

export function arrayAllFilter<Row extends DefaultRow>(
  row: TableRow<Row>,
  columnId: string,
  filterValue: unknown,
): boolean {
  if (!isArray(filterValue) || filterValue.length === 0) return true;

  const value = getData(row.original, columnId);
  if (!isArray(value)) return true;

  if (value.length !== filterValue.length) return false;

  return filterValue.every((filter) => value.includes(filter));
}
