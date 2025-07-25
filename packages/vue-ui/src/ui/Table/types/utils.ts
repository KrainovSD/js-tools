/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Cell,
  CellContext as CellContextLib,
  ColumnDef as ColumnDefLib,
  ColumnFilter as ColumnFilterLib,
  ColumnFiltersState as ColumnFiltersStateLib,
  ColumnOrderState as ColumnOrderStateLib,
  ColumnPinningState as ColumnPinningStateLib,
  ColumnSizingState as ColumnSizingStateLib,
  ColumnSort as ColumnSortLib,
  ExpandedState as ExpandedStateLib,
  GroupingState as GroupingStateLib,
  Header,
  HeaderContext as HeaderContextLib,
  HeaderGroup,
  PaginationState as PaginationStateLib,
  Row,
  RowData,
  RowModel as RowModelLib,
  RowSelectionState as RowSelectionStateLib,
  SortingState as SortingStateLib,
  Table,
} from "@tanstack/vue-table";
import type { Component, Ref } from "vue";

export type ToRef<T extends Record<string, unknown>> = {
  [K in keyof T]: Ref<T[K]>;
};

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

export type CellRenderProps<RowData extends DefaultRow, Settings = any> = {
  context: CellContext<RowData>;
  settings?: Settings;
};
export type CellRenderComponent<RowData extends DefaultRow> = Component<CellRenderProps<RowData>>;

export type HeaderRenderProps<RowData extends DefaultRow, Settings = any> = {
  context: HeaderContext<RowData>;
  settings?: Settings;
};
export type HeaderRenderComponent<RowData extends DefaultRow> = Component<
  HeaderRenderProps<RowData>
>;

export type FilterRenderProps<RowData extends DefaultRow, Settings = any> = {
  context: HeaderContext<RowData>;
  settings?: Settings;
};
export type FilterRenderComponent<RowData extends DefaultRow> = Component<
  FilterRenderProps<RowData>
>;

export type SortRenderProps<RowData extends DefaultRow, Settings = any> = {
  context: HeaderContext<RowData>;
  settings?: Settings;
};
export type SortRenderComponent<RowData extends DefaultRow> = Component<SortRenderProps<RowData>>;

export type CellClassInterface<RowData extends DefaultRow> = string | CellClassFn<RowData>;
export type CellClassFn<RowData extends DefaultRow, Settings = any> = (
  context: CellContext<RowData>,
  settings?: Settings,
) => string | undefined;
export type HeaderClassInterface<RowData extends DefaultRow> = string | HeaderClassFn<RowData>;
export type HeaderClassFn<RowData extends DefaultRow, Settings = any> = (
  context: HeaderContext<RowData>,
  settings?: Settings,
) => string | undefined;

export type HeaderContext<RowData extends DefaultRow> = HeaderContextLib<RowData, unknown>;
export type CellContext<RowData extends DefaultRow> = CellContextLib<RowData, unknown>;
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
export type RowModel<RowData extends DefaultRow> = RowModelLib<RowData>;

export type DefaultRow = RowData;
export type ColumnDef<RowData extends DefaultRow> = ColumnDefLib<RowData>;
export type DefaultGanttData = Record<string, unknown>;
export type ColumnSort = ColumnSortLib;
export type ColumnFilter = ColumnFilterLib;
export type ColumnsSortingState = ColumnSort[];
export type ColumnsFilterState = ColumnFilter[];
export type ColumnsSizingState = Record<string, number>;
export type ColumnsExpandState = Record<string, boolean>;
export type ColumnsOrderState = string[];
export type TableInterface<TData extends DefaultRow> = Table<TData>;
export type RowInterface<TData extends DefaultRow> = Row<TData>;
export type HeaderGroupInterface<TData extends DefaultRow> = HeaderGroup<TData>;
export type HeaderInterface<TData extends DefaultRow> = Header<TData, unknown>;
export type CellInterface<TData extends DefaultRow> = Cell<TData, unknown>;

export type SortingState = SortingStateLib;
export type ColumnFiltersState = ColumnFiltersStateLib;
export type ColumnOrderState = ColumnOrderStateLib;
export type ColumnPinningState = ColumnPinningStateLib;
export type ColumnSizingState = ColumnSizingStateLib;
export type ColumnsVisibleState = Record<string, boolean>;
export type ExpandedState = ExpandedStateLib;
export type GroupingState = GroupingStateLib;
export type PaginationState = PaginationStateLib;
export type RowSelectionState = RowSelectionStateLib;
