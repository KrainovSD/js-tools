import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  RowSelectionState,
  SortingState,
  TableOptions,
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
  HeaderInterface,
  HeaderRenderComponent,
  RowInterface,
  RowModel,
  SortFn,
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
  expander?: Component<CellRenderProps<RowData, never>>;
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
  filters: Record<string, unknown>;
  filterOptions: unknown[];
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
  getSubRows?: TableOptions<RowData>["getSubRows"];
  onExpandedChange?: TableOptions<RowData>["onExpandedChange"];
  columnResizeMode?: TableOptions<RowData>["columnResizeMode"];
  onGroupingChange?: TableOptions<RowData>["onGroupingChange"];
  onColumnOrderChange?: TableOptions<RowData>["onColumnOrderChange"];
  manualFiltering?: TableOptions<RowData>["manualFiltering"];
  manualExpanding?: TableOptions<RowData>["manualExpanding"];
  manualGrouping?: TableOptions<RowData>["manualGrouping"];
  manualPagination?: TableOptions<RowData>["manualPagination"];
  manualSorting?: TableOptions<RowData>["manualSorting"];
  onColumnFiltersChange?: TableOptions<RowData>["onColumnFiltersChange"];
  onColumnPinningChange?: TableOptions<RowData>["onColumnPinningChange"];
  onColumnSizingChange?: TableOptions<RowData>["onColumnSizingChange"];
  onColumnSizingInfoChange?: TableOptions<RowData>["onColumnSizingInfoChange"];
  onColumnVisibilityChange?: TableOptions<RowData>["onColumnVisibilityChange"];
  onPaginationChange?: TableOptions<RowData>["onPaginationChange"];
  onSortingChange?: TableOptions<RowData>["onSortingChange"];
  onRowSelectionChange?: TableOptions<RowData>["onRowSelectionChange"];
  getRowId?: TableOptions<RowData>["getRowId"];
} & {
  initialSorting: SortingState;
  initialColumnFilters: ColumnFiltersState;
  initialColumnOrder: ColumnOrderState;
  initialColumnPinning: ColumnPinningState;
  initialColumnSizing: ColumnSizingState;
  initialColumnVisibility: ColumnsVisibleState;
  initialExpanded: ExpandedState;
  initialGrouping: GroupingState;
  initialPagination: PaginationState;
  initialRowSelection: RowSelectionState;
} & {
  rows: RowData[];
  frozenHeader?: boolean;
  showPerf?: boolean;
  className?: string;
  renderers?: TableRenderers<RowData>;
  withPagination?: boolean;
  withFilters?: boolean;
  withTotal?: boolean;
  totalRows?: number;
  initialPageSize?: number;
  pageSizes?: number[];
  fullSize?: boolean;
  virtualColumn?: boolean;
  rubberColumn?: boolean;
  virtualColumnOverScan?: number;
  virtualRows?: boolean;
  virtualRowSize?: number;
  virtualRowOverScan?: number;
  locale?: string;
  onClickRow?: (row: RowInterface<RowData>, event: MouseEvent) => void;
  onDoubleClickRow?: (row: RowInterface<RowData>, event: MouseEvent) => void;
  Filter?: Component<TableFilterProps<RowData>>;
  Pagination?: Component<TablePaginationProps<RowData>>;
  Empty?: Component<TableEmptyProps>;
  Loader?: Component<TableLoaderProps>;
  loading?: boolean;
  headerRowClassName?: ((header: HeaderInterface<RowData>) => string | undefined) | string;
  rowClassName?: ((row: RowInterface<RowData>) => string | undefined) | string;
  rowRender?: (row: RowInterface<RowData>) => React.JSX.Element | null | undefined;
  getExpandedRowModel?: () => (table: TableInterface<RowData>) => () => RowModel<RowData>;
  draggableRow?: boolean;
  onDraggableRow?: DragRowHandler;
} & GanttProps<RowData, GanttData>;
