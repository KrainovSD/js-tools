import type { FilterFieldType, FilterInputValueType } from "@krainovsd/react-ui";
import type { ReactNode } from "react";
import type {
  CellContext,
  CellRenderComponent,
  DefaultRow,
  FilterRenderComponent,
  HeaderContext,
  HeaderRenderComponent,
  SortRenderComponent,
  TableInterface,
} from "./utils";

export type TableCellRenderKey = "default" | "select" | "tag" | "empty" | "drag";
export type TableHeaderRenderKey = "default" | "select" | "empty";
export type TableFilterRenderKey =
  | "number"
  | "number-range"
  | "select"
  | "string"
  | "date"
  | "date-range";
export type TableSortRenderKey = "single-arrow" | "double-arrow";
export type TableCellClassKey = "common" | "empty" | "nowrap" | "lineClamp" | "wCenter" | "hCenter";
export type TableHeaderClassKey =
  | "common"
  | "empty"
  | "nowrap"
  | "lineClamp"
  | "wCenter"
  | "hCenter";

export type TableCellRenders<RowData extends DefaultRow> = Record<
  TableCellRenderKey,
  CellRenderComponent<RowData>
>;
export type TableHeaderRenders<RowData extends DefaultRow> = Record<
  TableHeaderRenderKey,
  HeaderRenderComponent<RowData>
>;
export type TableFilterRenders<RowData extends DefaultRow> = Record<
  TableFilterRenderKey,
  FilterRenderComponent<RowData>
>;
export type TableSortRenders<RowData extends DefaultRow> = Record<
  TableSortRenderKey,
  SortRenderComponent<RowData>
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
  | "array-some-in-array"
  | "array-every-in-array"
  | "array-equals"
  | "array-some-in-primitive"
  | "date-in-range"
  | "date"
  | "number-in-range"
  | "includes-string";

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

export type DragRowHandler = (
  sourceIndex: number,
  targetIndex: number,
  sourceId: number | string,
  targetId: number | string,
) => void;
