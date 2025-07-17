import { type DayJS, isArray, isId, transformToDayjs } from "@krainovsd/js-helpers";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import type { DefaultRow, RowInterface } from "../types";

dayjs.extend(isBetween);

function isFalsy(val: unknown) {
  return val == undefined || val === "";
}
function isEmptyArray(val: unknown) {
  return !Array.isArray(val) || val.length === 0;
}

/** Equals */
export function equalsFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: unknown,
): boolean {
  return row.getValue(columnId) === filterValue;
}
export function notEqualsFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: unknown,
): boolean {
  return row.getValue(columnId) !== filterValue;
}
Object.defineProperty(equalsFilter, "autoRemove", {
  value: isFalsy,
  enumerable: true,
});
Object.defineProperty(notEqualsFilter, "autoRemove", {
  value: isFalsy,
  enumerable: true,
});

/** Includes String */
export function includesStringFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: string | string[],
): boolean {
  const columnValue = row.getValue(columnId);

  if (Array.isArray(filterValue)) {
    if (typeof columnValue === "string") {
      return filterValue.some((filter) => filter === columnValue);
    }

    return true;
  }

  const search = filterValue?.toString?.()?.toLowerCase?.();

  return Boolean(columnValue?.toString?.()?.toLowerCase?.()?.includes?.(search));
}
export function notIncludesStringFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: string,
): boolean {
  return !includesStringFilter(row, columnId, filterValue);
}
function includesStringAutoRemove(val: unknown) {
  return isFalsy(val) || (Array.isArray(val) && val.length === 0);
}
Object.defineProperty(includesStringFilter, "autoRemove", {
  value: includesStringAutoRemove,
  enumerable: true,
});
Object.defineProperty(notIncludesStringFilter, "autoRemove", {
  value: includesStringAutoRemove,
  enumerable: true,
});

/** Number in Range */
export function numberInRangeFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: [number, number],
): boolean {
  const [min, max] = filterValue;
  const rowValue = row.getValue<number>(columnId);

  return rowValue >= min && rowValue <= max;
}
export function notNumberInRangeFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: [number, number],
): boolean {
  return !numberInRangeFilter(row, columnId, filterValue);
}
function numberInRangeResolveValue(val: [unknown, unknown]) {
  const [unsafeMin, unsafeMax] = val;

  const parsedMin = typeof unsafeMin !== "number" ? parseFloat(unsafeMin as string) : unsafeMin;
  const parsedMax = typeof unsafeMax !== "number" ? parseFloat(unsafeMax as string) : unsafeMax;

  let min = unsafeMin === null || Number.isNaN(parsedMin) ? -Infinity : parsedMin;
  let max = unsafeMax === null || Number.isNaN(parsedMax) ? Infinity : parsedMax;

  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  return [min, max] as const;
}
Object.defineProperty(numberInRangeFilter, "resolveFilterValue", {
  value: numberInRangeResolveValue,
  enumerable: true,
});
Object.defineProperty(notNumberInRangeFilter, "resolveFilterValue", {
  value: numberInRangeResolveValue,
  enumerable: true,
});

/** Includes Array Some */
export function includesArraySomeFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: unknown[],
): boolean {
  return filterValue.some((val) => row.getValue<unknown[]>(columnId)?.includes(val));
}
export function notIncludesArraySomeFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: unknown[],
): boolean {
  return !includesArraySomeFilter(row, columnId, filterValue);
}
Object.defineProperty(includesArraySomeFilter, "autoRemove", {
  value: isEmptyArray,
  enumerable: true,
});
Object.defineProperty(notIncludesArraySomeFilter, "autoRemove", {
  value: isEmptyArray,
  enumerable: true,
});
/** Includes Array Every */
export function includesArrayEveryFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: unknown[],
): boolean {
  return !filterValue.some((val) => !row.getValue<unknown[]>(columnId)?.includes(val));
}
export function notIncludesArrayEveryFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: unknown[],
): boolean {
  return !includesArrayEveryFilter(row, columnId, filterValue);
}
Object.defineProperty(includesArrayEveryFilter, "autoRemove", {
  value: isEmptyArray,
  enumerable: true,
});
Object.defineProperty(notIncludesArrayEveryFilter, "autoRemove", {
  value: isEmptyArray,
  enumerable: true,
});
/** Array Equals */
export function arrayEqualsFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: unknown[],
): boolean {
  const columnValue = row.getValue<unknown[]>(columnId);
  if (columnValue.length !== filterValue.length) return false;

  return !filterValue.some((val) => !row.getValue<unknown[]>(columnId)?.includes(val));
}
export function notArrayEqualsFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: unknown[],
): boolean {
  return !arrayEqualsFilter(row, columnId, filterValue);
}
Object.defineProperty(arrayEqualsFilter, "autoRemove", {
  value: isEmptyArray,
  enumerable: true,
});
Object.defineProperty(notArrayEqualsFilter, "autoRemove", {
  value: isEmptyArray,
  enumerable: true,
});
/** Date */
export function dateFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: DayJS,
): boolean {
  return filterValue.isSame(row.getValue(columnId), "day");
}
export function notDateFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: DayJS,
): boolean {
  return !filterValue.isSame(row.getValue(columnId), "day");
}
function dateResolveFilterValue(value: unknown) {
  if (isId(value)) {
    return transformToDayjs(value);
  }

  return null;
}
Object.defineProperty(dateFilter, "resolveFilterValue", {
  value: dateResolveFilterValue,
  enumerable: true,
});
Object.defineProperty(notDateFilter, "resolveFilterValue", {
  value: dateResolveFilterValue,
  enumerable: true,
});
Object.defineProperty(dateFilter, "autoRemove", {
  value: isFalsy,
  enumerable: true,
});
Object.defineProperty(notDateFilter, "autoRemove", {
  value: isFalsy,
  enumerable: true,
});
/** Date in Range */
export function dateInRangeFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: [DayJS, DayJS],
): boolean {
  const columnValue = transformToDayjs(row.getValue(columnId));

  return columnValue.isBetween(filterValue[0], filterValue[1], "day", "[]");
}
export function notDateInRangeFilter<Row extends DefaultRow>(
  row: RowInterface<Row>,
  columnId: string,
  filterValue: [DayJS, DayJS],
): boolean {
  const columnValue = transformToDayjs(row.getValue(columnId));

  return !columnValue.isBetween(filterValue[0], filterValue[1], "day", "[]");
}
function dateRangeResolveFilterValue(value: unknown) {
  if (isArray(value) && isId(value[0]) && isId(value[1])) {
    return [transformToDayjs(value[0]), transformToDayjs(value[1])];
  }

  return null;
}
Object.defineProperty(dateInRangeFilter, "resolveFilterValue", {
  value: dateRangeResolveFilterValue,
  enumerable: true,
});
Object.defineProperty(notDateInRangeFilter, "resolveFilterValue", {
  value: dateRangeResolveFilterValue,
  enumerable: true,
});
Object.defineProperty(dateInRangeFilter, "autoRemove", {
  value: isEmptyArray,
  enumerable: true,
});
Object.defineProperty(notDateInRangeFilter, "autoRemove", {
  value: isEmptyArray,
  enumerable: true,
});
