import type {
  CellContext,
  ColumnDef,
  FilterFn,
  HeaderContext,
  Row,
  RowData,
  SortingFn,
  Table,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import type {
  DateCellRenderProps,
  DateFilterRenderProps,
  SelectFilterRenderProps,
  TagCellRenderProps,
  TextCellRenderProps,
} from "../module/table/components";

export type TableColumn<
  RowData extends Record<string, unknown>,
  CellRender = undefined,
  HeaderRender = undefined,
  FilterRender = undefined,
  SortRender = undefined,
  CellClass = undefined,
  HeaderClass = undefined,
  FilterType = undefined,
  SortType = undefined,
> = {
  icon?: ReactNode;
  name: string;
  key: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  leftFrozen?: boolean;
  rightFrozen?: boolean;
  resizable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  draggable?: boolean;
  grouping?: boolean;
  sortDirectionFirst?: "asc" | "desc";
  sortType?: SortType | SortingKey;
  filterType?: FilterType | FilterKey;
  props?: unknown;
} & TableCellRendersProps<RowData, CellRender> &
  TableHeaderRendersProps<HeaderRender> &
  TableFilterRendersProps<FilterRender> &
  TableSortRendersProps<SortRender> &
  TableCellClassesProps<CellClass> &
  TableHeaderClassesProps<HeaderClass>;

export type TableCellRendersProps<
  RowData extends Record<string, unknown>,
  CellRender = undefined,
> =
  | {
      cellRender?: CellRender | Exclude<TableCellRenderKey, "date" | "text" | "tag">;
      cellRenderProps?: unknown;
    }
  | {
      cellRender: "date";
      cellRenderProps: DateCellRenderProps<RowData>;
    }
  | { cellRender: "text"; cellRenderProps: TextCellRenderProps<RowData> }
  | { cellRender: "tag"; cellRenderProps: TagCellRenderProps<RowData> };
export type TableHeaderRendersProps<HeaderRender = undefined> = {
  headerRender?: HeaderRender | TableHeaderRenderKey;
  headerRenderProps?: unknown;
};
export type TableFilterRendersProps<FilterRender = undefined> =
  | {
      filterRender?: FilterRender | Exclude<TableFilterRenderKey, "select" | "date" | "date-range">;
      filterRenderProps?: unknown;
    }
  | {
      filterRender?: "select";
      filterRenderProps: SelectFilterRenderProps;
    }
  | {
      filterRender?: "date";
      filterRenderProps: DateFilterRenderProps;
    }
  | {
      filterRender?: "date-range";
      filterRenderProps: DateFilterRenderProps;
    };
export type TableSortRendersProps<SortRender = undefined> = {
  sortRender?: SortRender | TableSortRenderKey;
  sortRenderProps?: unknown;
};
export type TableCellClassesProps<CellClass = undefined> = {
  cellClass?: (CellClass | TableCellClassKey)[];
  cellClassProps?: unknown;
};
export type TableHeaderClassesProps<HeaderClass = undefined> = {
  headerClass?: (HeaderClass | TableHeaderClassKey)[];
  headerClassProps?: unknown;
};

export type TableDefaultColumnOptions<
  RowData extends Record<string, unknown>,
  CellRender = undefined,
  HeaderRender = undefined,
  FilterRender = undefined,
  SortRender = undefined,
  CellClass = undefined,
  HeaderClass = undefined,
  FilterType = undefined,
  SortType = undefined,
> = Pick<
  TableColumn<
    RowData,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >,
  | "resizable"
  | "sortable"
  | "filterable"
  | "draggable"
  | "sortDirectionFirst"
  | "cellClass"
  | "headerClass"
  | "cellRender"
  | "headerRender"
  | "filterRender"
  | "sortRender"
  | "sortType"
  | "filterType"
>;

export type TableColumnsSettings<
  Row extends Record<string, unknown>,
  CellRender = undefined,
  HeaderRender = undefined,
  FilterRender = undefined,
  SortRender = undefined,
  CellClass = undefined,
  HeaderClass = undefined,
  FilterType = undefined,
  SortType = undefined,
> = {
  columns: TableColumn<
    Row,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >[];
  cellRenders?: CellRender extends string
    ? Record<CellRender, (props: { context: CellContext<Row, unknown> }) => ReactNode>
    : undefined;
  headerRenders?: HeaderRender extends string
    ? Record<HeaderRender, (props: { context: HeaderContext<Row, unknown> }) => ReactNode>
    : undefined;
  filterRenders?: FilterRender extends string
    ? Record<FilterRender, (props: ColumnDef<Row>) => ReactNode>
    : undefined;
  sortRenders?: SortRender extends string
    ? Record<SortRender, (props: { context: HeaderContext<Row, unknown> }) => ReactNode>
    : undefined;
  cellClasses?: CellClass extends string
    ? Record<CellClass, string | ((props: CellContext<Row, unknown>) => string)>
    : undefined;
  headerClasses?: HeaderClass extends string
    ? Record<HeaderClass, string | ((props: HeaderContext<Row, unknown>) => string)>
    : undefined;
  filterTypes?: FilterType extends string ? Record<FilterType, FilterFn<Row>> : undefined;
  sortTypes?: SortType extends string ? Record<SortType, SortingFn<Row>> : undefined;
  defaultColumnOptions?: TableDefaultColumnOptions<
    Row,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass
  >;
};

export type TableCellRenderKey = "date" | "text" | "empty" | "tag";
export type TableHeaderRenderKey = "common";
export type TableFilterRenderKey =
  | "number"
  | "number-range"
  | "select"
  | "string"
  | "date"
  | "date-range";
export type TableSortRenderKey = "single-arrow" | "double-arrow";
export type TableCellClassKey = "common" | "empty" | "nowrap" | "lineClamp";
export type TableHeaderClassKey = "common" | "empty" | "nowrap" | "lineClamp";

export type TableCellRenders<Row> = Record<
  TableCellRenderKey,
  (props: { context: CellContext<Row, unknown> }) => ReactNode
>;
export type TableHeaderRenders<Row> = Record<
  TableHeaderRenderKey,
  (props: { context: HeaderContext<Row, unknown> }) => ReactNode
>;
export type TableFilterRenders<Row> = Record<
  TableFilterRenderKey,
  (props: ColumnDef<Row>) => ReactNode
>;
export type TableSortRenders<Row> = Record<
  TableSortRenderKey,
  (props: { context: HeaderContext<Row, unknown> }) => ReactNode
>;
export type TableCellClasses<Row> = Record<
  TableCellClassKey,
  string | ((props: CellContext<Row, unknown>) => string)
>;
export type TableHeaderClasses<Row> = Record<
  TableHeaderClassKey,
  string | ((props: HeaderContext<Row, unknown>) => string)
>;

export type TableRenderers<Row extends RowData> = {
  expander?: (props: { context: CellContext<Row, unknown> }) => ReactNode;
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

export type TableInterface<TData extends RowData> = Table<TData>;
export type RowInterface<TData extends RowData> = Row<TData>;

export type GanttProps<
  RowData extends Record<string, unknown>,
  GanttData extends Record<string, unknown>,
> = {
  withGantt?: boolean;
  firstGanttDate?: string;
  lastGanttDate?: string;
  ganttRowMini?: boolean;
  ganttInfoGetter?: (row: RowInterface<RowData>) => GanttInfo<GanttData>;
  instantGanttSplitter?: boolean;
  ganttGrid?: boolean;
  GanttTooltip?: React.FC<{ row: RowInterface<RowData> }>;
  GanttTask?:
    | React.FC<{
        row: RowInterface<RowData>;
        ganttInfo: GanttInfo<GanttData>;
        rowInfo: GanttRowInfo;
        bodyWidth: number | null;
      }>
    | undefined;
  ganttView?: GanttViewType;
};

export type GanttTypeShapes = "task" | "group" | "milestone";
export type GanttViewType = "years" | "months" | "quarters" | "weeks";

export type GanttInfo<GanttData extends Record<string, unknown>> = {
  id: number | string;
  start: string;
  end: string;
  name: string;
  type: GanttTypeShapes;
  progress?: number;
  dependents?: (string | number)[];
  props?: GanttData;
};

export type GanttDate = {
  year: number;
  month: number;
  day: number;
};

export type GanttRowInfo = {
  index: number;
  left: number;
  top: number;
  width: number;
  height: number;
  textWidth: number;
};
