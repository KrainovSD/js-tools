import { getByPath, isArray, isId } from "@krainovsd/js-helpers";
import type { DefaultRow, RowInterface } from "../types";

export function stringSort<Row extends DefaultRow>(
  rowA: RowInterface<Row>,
  rowB: RowInterface<Row>,
  columnId: string,
): number {
  const dataA = getByPath<string>(rowA.original, columnId);
  const dataB = getByPath<string>(rowB.original, columnId);

  if (dataA === dataB) return 0;
  if (dataA == undefined && dataB != undefined) return 1;
  if (dataA != undefined && dataB == undefined) return 0;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return dataA! > dataB! ? 1 : -1;
}

export function numberSort<Row extends DefaultRow>(
  rowA: RowInterface<Row>,
  rowB: RowInterface<Row>,
  columnId: string,
): number {
  let dataA = getByPath<string | number | undefined>(rowA.original, columnId);
  let dataB = getByPath<string | number | undefined>(rowB.original, columnId);

  if (dataA == undefined && dataB == undefined) return 0;
  if (dataA == undefined) return -1;
  if (dataB == undefined) return 1;

  dataA = +dataA;
  dataB = +dataB;

  if (Number.isNaN(dataA) && Number.isNaN(dataB)) return 0;
  if (Number.isNaN(dataA)) return -1;
  if (Number.isNaN(dataB)) return 1;

  return dataA - dataB;
}

export function booleanSort<Row extends DefaultRow>(
  rowA: RowInterface<Row>,
  rowB: RowInterface<Row>,
  columnId: string,
): number {
  const dataA = +Boolean(getByPath<string | number | boolean>(rowA.original, columnId));
  const dataB = +Boolean(getByPath<string | number | boolean>(rowB.original, columnId));

  return dataA - dataB;
}

export function arraySort<Row extends DefaultRow>(
  rowA: RowInterface<Row>,
  rowB: RowInterface<Row>,
  columnId: string,
): number {
  const arrayA = getByPath(rowA.original, columnId);
  const arrayB = getByPath(rowB.original, columnId);
  const dataA = isArray(arrayA) ? arrayA.length : 0;
  const dataB = isArray(arrayB) ? arrayB.length : 0;

  return dataA - dataB;
}

export function dateSort<Row extends DefaultRow>(
  rowA: RowInterface<Row>,
  rowB: RowInterface<Row>,
  columnId: string,
): number {
  const dataA = getByPath(rowA.original, columnId);
  const dataB = getByPath(rowB.original, columnId);
  const dateA = new Date(isId(dataA) ? dataA : String(dataA)).getTime();
  const dateB = new Date(isId(dataB) ? dataB : String(dataB)).getTime();

  if (Number.isNaN(dateA) && Number.isNaN(dateB)) return 0;
  if (Number.isNaN(dateA)) return -1;
  if (Number.isNaN(dateB)) return 1;

  return dateA - dateB;
}
