import type { FilterFieldType, FilterInputValueType } from "@krainovsd/react-ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { CellContext, DefaultRow, HeaderContext, TableInterface } from "./utils";

export type TableCellRenderKey = "default" | "select" | "tag" | "empty";
export type TableHeaderRenderKey = "common" | "select" | "empty";
export type TableFilterRenderKey =
  | "number"
  | "number-range"
  | "select"
  | "string"
  | "date"
  | "date-range";
export type TableSortRenderKey = "single-arrow" | "double-arrow";
export type TableCellClassKey =
  | "common"
  | "empty"
  | "nowrap"
  | "lineClamp"
  | "wCenter"
  | "hCenter"
  | "padding";
export type TableHeaderClassKey =
  | "common"
  | "empty"
  | "nowrap"
  | "lineClamp"
  | "wCenter"
  | "hCenter";

export type TableCellRenders<RowData extends DefaultRow> = Record<
  TableCellRenderKey,
  (props: { context: CellContext<RowData> }) => ReactNode
>;
export type TableHeaderRenders<RowData extends DefaultRow> = Record<
  TableHeaderRenderKey,
  (props: { context: HeaderContext<RowData> }) => ReactNode
>;
export type TableFilterRenders<RowData extends DefaultRow> = Record<
  TableFilterRenderKey,
  (props: ColumnDef<RowData>) => ReactNode
>;
export type TableSortRenders<RowData extends DefaultRow> = Record<
  TableSortRenderKey,
  (props: { context: HeaderContext<RowData> }) => ReactNode
>;
export type TableCellClasses<RowData extends DefaultRow> = Record<
  TableCellClassKey,
  string | ((props: CellContext<RowData>) => string)
>;
export type TableHeaderClasses<RowData extends DefaultRow> = Record<
  TableHeaderClassKey,
  string | ((props: HeaderContext<RowData>) => string)
>;

export type TableRenderers<RowData extends DefaultRow> = {
  expander?: (props: { context: CellContext<RowData> }) => ReactNode;
};

export type SortingKey = "number" | "string" | "boolean" | "date" | "array" | "string-with-number";
export type FilterKey =
  | "equals"
  | "date-in-range"
  | "date"
  | "number-in-range"
  | "includes-string"
  | "includes-string-one-of-array"
  | "includes-array-every"
  | "includes-array-all"
  | "includes-array-some";

export type TablePaginationProps<RowData extends DefaultRow> = {
  table: TableInterface<RowData>;
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  pageSizes: number[];
};
export type TableFilterProps<RowData extends DefaultRow> = {
  table: TableInterface<RowData>;
  filters: Record<string, FilterInputValueType>;
  filterOptions: FilterFieldType[];
};
export type TableEmptyProps = {};
export type TableLoaderProps = {};
