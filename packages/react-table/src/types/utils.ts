import type {
  CellContext as CellContextLib,
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

export type TableTypesGetter<RowData extends DefaultRow> = {
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
