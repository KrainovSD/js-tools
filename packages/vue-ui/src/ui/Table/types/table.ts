import type { TableOptions, TableState } from "@tanstack/vue-table";
import type { Component } from "vue";
import type { TableColumnsSettings } from "./columns";
import type { GanttProps } from "./gantt";
import type {
  CellClassInterface,
  CellContext,
  CellRenderComponent,
  CellRenderProps,
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
> &
  Pick<
    TableOptions<RowData>,
    | "getSubRows"
    | "onExpandedChange"
    | "columnResizeMode"
    | "onGroupingChange"
    | "onColumnOrderChange"
    | "manualFiltering"
    | "manualExpanding"
    | "manualGrouping"
    | "manualPagination"
    | "manualSorting"
    | "onColumnFiltersChange"
    | "onColumnPinningChange"
    | "onColumnSizingChange"
    | "onColumnSizingInfoChange"
    | "onColumnVisibilityChange"
    | "onPaginationChange"
    | "onSortingChange"
    | "onRowSelectionChange"
    | "getRowId"
  > &
  Pick<
    Partial<TableState>,
    | "sorting"
    | "columnFilters"
    | "columnOrder"
    | "columnPinning"
    | "columnSizing"
    | "columnVisibility"
    | "expanded"
    | "grouping"
    | "pagination"
    | "rowSelection"
  > & {
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
    onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
    onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
    Filter?: React.FC<TableFilterProps<RowData>>;
    Pagination?: React.FC<TablePaginationProps<RowData>>;
    Empty?: React.FC<TableEmptyProps>;
    Loader?: React.FC<TableLoaderProps>;
    loading?: boolean;
    setTable?: (table: TableInterface<RowData>) => void;
    rootRef?: React.MutableRefObject<HTMLDivElement | null>;
    headerRowClassName?: ((header: HeaderInterface<RowData>) => string | undefined) | string;
    rowClassName?: ((row: RowInterface<RowData>) => string | undefined) | string;
    rowRender?: (row: RowInterface<RowData>) => React.JSX.Element | null | undefined;
    getExpandedRowModel?: () => (table: TableInterface<RowData>) => () => RowModel<RowData>;
    draggableRow?: boolean;
    onDraggableRow?: DragRowHandler;
  } & GanttProps<RowData, GanttData>;
