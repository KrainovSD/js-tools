import type {
  CellContext as CellContextLib,
  ColumnDef as ColumnDefLib,
  ColumnFilter as ColumnFilterLib,
  ColumnSort as ColumnSortLib,
  HeaderContext as HeaderContextLib,
  HeaderGroup,
  PaginationState as PaginationStateLib,
  Row,
  RowData,
  RowModel as RowModelLib,
  Table,
} from "@tanstack/react-table";
import type React from "react";

export type TableTypesGetter<RowData extends DefaultRow> = {
  headerRenderProps: HeaderRenderProps<RowData>;
  cellRenderProps: CellRenderProps<RowData>;
  headerContext: HeaderContextLib<RowData, unknown>;
  cellContext: CellContextLib<RowData, unknown>;
  row: RowInterface<RowData>;
  table: TableInterface<RowData>;
  rowModel: RowModelLib<RowData>;
  filterFn: (row: RowInterface<RowData>, columnId: string, filterValue: unknown) => boolean;
  sortFn: (rowA: RowInterface<RowData>, rowB: RowInterface<RowData>, columnId: string) => number;
};

export type HeaderContext<RowData extends DefaultRow> = HeaderContextLib<RowData, unknown>;
export type CellContext<RowData extends DefaultRow> = CellContextLib<RowData, unknown>;
export type RowModel<RowData extends DefaultRow> = RowModelLib<RowData>;

export type DefaultRow = RowData;
export type ColumnDef<RowData extends DefaultRow> = ColumnDefLib<RowData>;
export type DefaultGanttData = Record<string, unknown>;
export type ColumnSort = ColumnSortLib;
export type ColumnFilter = ColumnFilterLib;
export type ColumnsSortingState = ColumnSort[];
export type ColumnsFilterState = ColumnFilter[];
export type ColumnsVisibleState = Record<string, boolean>;
export type ColumnsSizingState = Record<string, number>;
export type ColumnsExpandState = Record<string, boolean>;
export type ColumnsOrderState = string[];
export type PaginationState = PaginationStateLib;
export type TableInterface<TData extends RowData> = Table<TData>;
export type RowInterface<TData extends RowData> = Row<TData>;
export type HeaderInterface<TData extends RowData> = HeaderGroup<TData>;

export type FilterFn<RowData extends DefaultRow> = (
  row: RowInterface<RowData>,
  columnId: string,
  filterValue: unknown,
) => boolean;
export type SortFn<RowData extends DefaultRow> = (
  rowA: RowInterface<RowData>,
  rowB: RowInterface<RowData>,
  columnId: string,
) => number;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CellRenderProps<RowData extends DefaultRow, Settings = any> = {
  context: CellContext<RowData>;
  settings?: Settings;
};
export type CellRenderComponent<RowData extends DefaultRow> = React.FC<CellRenderProps<RowData>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HeaderRenderProps<RowData extends DefaultRow, Settings = any> = {
  context: HeaderContext<RowData>;
  settings?: Settings;
};
export type HeaderRenderComponent<RowData extends DefaultRow> = React.FC<
  HeaderRenderProps<RowData>
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FilterRenderProps<RowData extends DefaultRow, Settings = any> = {
  context: ColumnDef<RowData>;
  settings?: Settings;
};
export type FilterRenderComponent<RowData extends DefaultRow> = React.FC<
  FilterRenderProps<RowData>
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SortRenderProps<RowData extends DefaultRow, Settings = any> = {
  context: HeaderContext<RowData>;
  settings?: Settings;
};
export type SortRenderComponent<RowData extends DefaultRow> = React.FC<SortRenderProps<RowData>>;

export type CellClassInterface<RowData extends DefaultRow> = string | CellClassFn<RowData>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CellClassFn<RowData extends DefaultRow, Settings = any> = (
  context: CellContext<RowData>,
  settings?: Settings,
) => string | undefined;

export type HeaderClassInterface<RowData extends DefaultRow> = string | HeaderClassFn<RowData>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HeaderClassFn<RowData extends DefaultRow, Settings = any> = (
  context: HeaderContext<RowData>,
  settings?: Settings,
) => string | undefined;
