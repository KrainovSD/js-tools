import { isArray, isId } from "@krainovsd/js-helpers";
import type { Row as RowLibrary } from "@tanstack/react-table";
import { getData } from "./lodash";

export function stringSort<Row extends Record<string, unknown>>(
  rowA: RowLibrary<Row>,
  rowB: RowLibrary<Row>,
  columnId: string,
): number {
  const dataA = getData(rowA.original, columnId);
  const dataB = getData(rowB.original, columnId);

  if (dataA === dataB) return 0;

  return dataA > dataB ? 1 : -1;
}

export function numberSort<Row extends Record<string, unknown>>(
  rowA: RowLibrary<Row>,
  rowB: RowLibrary<Row>,
  columnId: string,
): number {
  const dataA = +getData(rowA.original, columnId);
  const dataB = +getData(rowB.original, columnId);

  if (Number.isNaN(dataA) && Number.isNaN(dataB)) return 0;
  if (Number.isNaN(dataA)) return -1;
  if (Number.isNaN(dataB)) return 1;

  return dataA - dataB;
}

export function booleanSort<Row extends Record<string, unknown>>(
  rowA: RowLibrary<Row>,
  rowB: RowLibrary<Row>,
  columnId: string,
): number {
  const dataA = +Boolean(getData(rowA.original, columnId));
  const dataB = +Boolean(getData(rowB.original, columnId));

  return dataA - dataB;
}

export function arraySort<Row extends Record<string, unknown>>(
  rowA: RowLibrary<Row>,
  rowB: RowLibrary<Row>,
  columnId: string,
): number {
  const arrayA = getData(rowA.original, columnId);
  const arrayB = getData(rowB.original, columnId);
  const dataA = isArray(arrayA) ? arrayA.length : 0;
  const dataB = isArray(arrayB) ? arrayB.length : 0;

  return dataA - dataB;
}

export function dateSort<Row extends Record<string, unknown>>(
  rowA: RowLibrary<Row>,
  rowB: RowLibrary<Row>,
  columnId: string,
): number {
  const dataA = getData(rowA.original, columnId);
  const dataB = getData(rowB.original, columnId);
  const dateA = new Date(isId(dataA) ? dataA : String(dataA)).getTime();
  const dateB = new Date(isId(dataB) ? dataB : String(dataB)).getTime();

  if (Number.isNaN(dateA) && Number.isNaN(dateB)) return 0;
  if (Number.isNaN(dateA)) return -1;
  if (Number.isNaN(dateB)) return 1;

  return dateA - dateB;
}
