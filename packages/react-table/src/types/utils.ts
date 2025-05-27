import type {
  CellContext,
  ColumnFilter as ColumnFilterLib,
  ColumnSort as ColumnSortLib,
  HeaderContext,
  PaginationState as PaginationStateLib,
  Row,
} from "@tanstack/react-table";
import type { TableInterface } from "./table";

export type TableTypesGetter<RowData extends Record<string, unknown>> = {
  headerContext: HeaderContext<RowData, unknown>;
  cellContext: CellContext<RowData, unknown>;
  row: Row<RowData>;
  table: TableInterface<RowData>;
};

export type ColumnSort = ColumnSortLib;
export type ColumnFilter = ColumnFilterLib;
export type ColumnsSortingState = ColumnSort[];
export type ColumnsFilterState = ColumnFilter[];
export type ColumnsVisibleState = Record<string, boolean>;
export type ColumnsSizingState = Record<string, number>;
export type ColumnsExpandState = Record<string, boolean>;
export type ColumnsOrderState = string[];
export type PaginationState = PaginationStateLib;
