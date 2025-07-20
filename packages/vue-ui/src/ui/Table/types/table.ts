import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnResizeMode,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  RowSelectionState,
  SortingState,
} from "@tanstack/vue-table";
import type { PaginationState } from "@tanstack/vue-table";
import type { Component } from "vue";
import type { TableColumnsSettings } from "./columns";
import type { GanttProps } from "./gantt";
import type {
  CellClassInterface,
  CellContext,
  CellRenderComponent,
  CellRenderProps,
  ColumnsVisibleState,
  DefaultGanttData,
  DefaultRow,
  FilterFn,
  FilterRenderComponent,
  HeaderClassInterface,
  HeaderContext,
  HeaderGroupInterface,
  HeaderRenderComponent,
  RowInterface,
  RowModel,
  SortFn,
  SortRenderComponent,
  TableInterface,
} from "./utils";

export type TableCellRenderKey = "default" | "select" | "tag" | "empty" | "drag" | "expand";
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
  expander?: Component<Omit<CellRenderProps<RowData, never>, "settings">>;
};

export type SortingKey = "number" | "string" | "boolean" | "date" | "array" | "string-with-number";
export type FilterKey =
  | "equals"
  | "not-equals"
  | "includes-string"
  | "not-includes-string"
  | "number-in-range"
  | "not-number-in-range"
  | "includes-array-some"
  | "not-includes-array-some"
  | "includes-array-every"
  | "not-includes-array-every"
  | "array-equals"
  | "not-array-equals"
  | "date"
  | "not-date"
  | "date-in-range"
  | "not-date-in-range";

export type TablePaginationProps<RowData extends DefaultRow> = {
  table: TableInterface<RowData>;
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  pageSizes: number[];
};
export type TableFilterProps<RowData extends DefaultRow> = {
  table: TableInterface<RowData>;
};
export type TableEmptyProps = {};
export type TableLoaderProps = {};

export type DragRowHandler = (
  sourceIndex: number,
  targetIndex: number,
  sourceId: number | string,
  targetId: number | string,
) => void;

export type TableProps<
  RowData extends DefaultRow,
  GanttData extends DefaultGanttData,
  CellRender extends Record<string, CellRenderComponent<RowData>>,
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>>,
  FilterRender extends Record<string, FilterRenderComponent<RowData>>,
  SortRender extends Record<string, SortRenderComponent<RowData>>,
  CellClass extends Record<string, CellClassInterface<RowData>>,
  HeaderClass extends Record<string, HeaderClassInterface<RowData>>,
  FilterType extends Record<string, FilterFn<RowData>>,
  SortType extends Record<string, SortFn<RowData>>,
> = TableColumnsSettings<
  RowData,
  CellRender,
  HeaderRender,
  FilterRender,
  SortRender,
  CellClass,
  HeaderClass,
  FilterType,
  SortType
> & {
  getSubRows?: (originalRow: RowData, index: number) => RowData[] | undefined;
  columnResizeMode?: ColumnResizeMode;
  manualFiltering?: boolean;
  manualExpanding?: boolean;
  manualGrouping?: boolean;
  manualPagination?: boolean;
  manualSorting?: boolean;
  getRowId?: (originalRow: RowData, index: number, parent?: RowInterface<RowData>) => string;
} & {
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  initialColumnOrder?: ColumnOrderState;
  initialColumnPinning?: ColumnPinningState;
  initialColumnSizing?: ColumnSizingState;
  initialColumnVisibility?: ColumnsVisibleState;
  initialExpanded?: ExpandedState;
  initialGrouping?: GroupingState;
  initialPagination?: PaginationState;
  initialRowSelection?: RowSelectionState;
} & {
  rows: RowData[];
  rowHeight?: number;
  headerHeight?: number;
  frozenHeader?: boolean;
  className?: string;
  renderers?: TableRenderers<RowData>;
  withPagination?: boolean;
  withFilters?: boolean;
  withTotal?: boolean;
  totalRows?: number;
  pageSizes?: number[];
  fullSize?: boolean;
  virtualColumn?: boolean;
  rubberColumn?: boolean;
  virtualColumnOverScan?: number;
  virtualRows?: boolean;
  virtualRowSize?: number;
  virtualRowOverScan?: number;
  locale?: string;
  Filter?: Component<TableFilterProps<RowData>>;
  Pagination?: Component<TablePaginationProps<RowData>>;
  Empty?: Component<TableEmptyProps>;
  Loader?: Component<TableLoaderProps>;
  loading?: boolean;
  headerRowClassName?: ((header: HeaderGroupInterface<RowData>) => string | undefined) | string;
  rowClassName?: ((row: RowInterface<RowData>) => string | undefined) | string;
  Row?: (row: RowInterface<RowData>) => Component | undefined;
  getExpandedRowModel?: () => (table: TableInterface<RowData>) => () => RowModel<RowData>;
  draggableRow?: boolean;
} & GanttProps<RowData, GanttData>;
