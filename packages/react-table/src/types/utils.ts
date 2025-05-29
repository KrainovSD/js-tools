import type {
  CellContext as CellContextLib,
  ColumnFilter as ColumnFilterLib,
  ColumnSort as ColumnSortLib,
  HeaderContext as HeaderContextLib,
  PaginationState as PaginationStateLib,
} from "@tanstack/react-table";
import type { RowInterface, TableInterface } from "./table";

export type TableTypesGetter<RowData extends Record<string, unknown>> = {
  headerContext: HeaderContextLib<RowData, unknown>;
  cellContext: CellContextLib<RowData, unknown>;
  row: RowInterface<RowData>;
  table: TableInterface<RowData>;
  filterFn: (row: RowInterface<RowData>, columnId: string, filterValue: unknown) => boolean;
  sortFn: (rowA: RowInterface<RowData>, rowB: RowInterface<RowData>, columnId: string) => number;
};

export type HeaderContext<RowData extends Record<string, unknown>> = HeaderContextLib<
  RowData,
  unknown
>;
export type CellContext<RowData extends Record<string, unknown>> = CellContextLib<RowData, unknown>;
export type Row<RowData extends Record<string, unknown>> = RowInterface<RowData>;
export type Table<RowData extends Record<string, unknown>> = TableInterface<RowData>;
export type FilterFn<RowData extends Record<string, unknown>> = (
  row: RowInterface<RowData>,
  columnId: string,
  filterValue: unknown,
) => boolean;
export type SortFn<RowData extends Record<string, unknown>> = (
  rowA: RowInterface<RowData>,
  rowB: RowInterface<RowData>,
  columnId: string,
) => number;

export type ColumnSort = ColumnSortLib;
export type ColumnFilter = ColumnFilterLib;
export type ColumnsSortingState = ColumnSort[];
export type ColumnsFilterState = ColumnFilter[];
export type ColumnsVisibleState = Record<string, boolean>;
export type ColumnsSizingState = Record<string, number>;
export type ColumnsExpandState = Record<string, boolean>;
export type ColumnsOrderState = string[];
export type PaginationState = PaginationStateLib;
