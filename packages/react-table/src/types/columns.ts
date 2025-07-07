import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type {
  CommonHeaderRenderProps,
  DateFilterRenderProps,
  DefaultCellRenderProps,
  SelectCellRenderProps,
  SelectFilterRenderProps,
  SelectHeaderRenderProps,
  TagCellRenderProps,
} from "../module/table/components";
import type {
  FilterKey,
  SortingKey,
  TableCellClassKey,
  TableCellRenderKey,
  TableFilterRenderKey,
  TableHeaderClassKey,
  TableHeaderRenderKey,
  TableSortRenderKey,
} from "./table";
import type { CellContext, DefaultRow, FilterFn, HeaderContext, SortFn } from "./utils";

export type TableColumn<
  RowData extends DefaultRow,
  CellRender extends string | undefined = undefined,
  CellRenderProps extends Record<CellRender extends string ? CellRender : string, unknown> = Record<
    CellRender extends string ? CellRender : string,
    unknown
  >,
  HeaderRender extends string | undefined = undefined,
  HeaderRenderProps extends Record<
    HeaderRender extends string ? HeaderRender : string,
    unknown
  > = Record<HeaderRender extends string ? HeaderRender : string, unknown>,
  FilterRender extends string | undefined = undefined,
  FilterRenderProps extends Record<
    FilterRender extends string ? FilterRender : string,
    unknown
  > = Record<FilterRender extends string ? FilterRender : string, unknown>,
  SortRender extends string | undefined = undefined,
  SortRenderProps extends Record<SortRender extends string ? SortRender : string, unknown> = Record<
    SortRender extends string ? SortRender : string,
    unknown
  >,
  CellClass extends string | undefined = undefined,
  CellClassProps = unknown,
  HeaderClass extends string | undefined = undefined,
  HeaderClassProps = unknown,
  FilterType extends string | undefined = undefined,
  SortType extends string | undefined = undefined,
  ColumnProps = unknown,
> = {
  renderKey?: string;
  icon?: ReactNode;
  name: string;
  key: keyof RowData | string;
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
  expandable?: boolean;
  expandedShift?: number;
  tooltip?: ColumnTooltipSettings<RowData> | boolean;
  className?: ((context: CellContext<RowData>) => string) | string;
  sortDirectionFirst?: "asc" | "desc";
  sortType?: SortType | SortingKey;
  filterType?: FilterType | FilterKey;
  props?: ColumnProps;
} & TableCellRendersProps<RowData, CellRender, CellRenderProps> &
  TableHeaderRendersProps<RowData, HeaderRender, HeaderRenderProps> &
  TableFilterRendersProps<FilterRender, FilterRenderProps> &
  TableSortRendersProps<SortRender, SortRenderProps> &
  TableCellClassesProps<CellClass, CellClassProps> &
  TableHeaderClassesProps<HeaderClass, HeaderClassProps>;

export type ColumnTooltipSettings<RowData extends DefaultRow> = {
  auto?: boolean;
  zIndex?: number;
  pathToContent?: keyof RowData;
  customContent?: string;
  arraySeparator?: string;
};

export type DefaultTableCellRenderProps<RowData extends DefaultRow> =
  | {
      cellRender?: "default";
      cellRenderProps?: DefaultCellRenderProps<RowData>;
    }
  | { cellRender?: "tag"; cellRenderProps?: TagCellRenderProps }
  | { cellRender?: "select"; cellRenderProps?: SelectCellRenderProps }
  | {
      cellRender?: Exclude<TableCellRenderKey, "text" | "tag" | "select">;
      cellRenderProps?: never;
    };
export type DefaultHeaderRenderProps<RowData extends DefaultRow> =
  | { headerRender?: "select"; headerRenderProps?: SelectHeaderRenderProps<RowData> }
  | { headerRender?: "common"; headerRenderProps?: CommonHeaderRenderProps<RowData> }
  | {
      headerRender?: Exclude<TableHeaderRenderKey, "select" | "common">;
      headerRenderProps?: never;
    };
export type DefaultFilterRenderProps =
  | {
      filterRender?: "select";
      filterRenderProps?: SelectFilterRenderProps;
    }
  | {
      filterRender?: "date";
      filterRenderProps?: DateFilterRenderProps;
    }
  | {
      filterRender?: "date-range";
      filterRenderProps?: DateFilterRenderProps;
    }
  | {
      filterRender?: Exclude<TableFilterRenderKey, "select" | "date" | "date-range">;
      filterRenderProps?: never;
    };
export type DefaultSortRenderProps = { sortRender?: TableSortRenderKey; sortRenderProps?: never };

export type TableCellRendersProps<
  RowData extends DefaultRow,
  CellRender extends string | undefined = undefined,
  CellRenderProps extends Record<CellRender extends string ? CellRender : string, unknown> = Record<
    CellRender extends string ? CellRender : string,
    unknown
  >,
> = CellRender extends string
  ? CellRenderProps extends Record<CellRender, unknown>
    ?
        | {
            [K in CellRender]: {
              cellRender: K;
              cellRenderProps?: CellRenderProps[K];
            };
          }[CellRender]
        | DefaultTableCellRenderProps<RowData>
    : { cellRender: CellRender; cellRenderProps?: unknown } | DefaultTableCellRenderProps<RowData>
  : DefaultTableCellRenderProps<RowData>;

export type TableHeaderRendersProps<
  RowData extends DefaultRow,
  HeaderRender extends string | undefined = undefined,
  HeaderRenderProps extends Record<
    HeaderRender extends string ? HeaderRender : string,
    unknown
  > = Record<HeaderRender extends string ? HeaderRender : string, unknown>,
> = HeaderRender extends string
  ? HeaderRenderProps extends Record<HeaderRender, unknown>
    ?
        | {
            [K in HeaderRender]: {
              headerRender: K;
              headerRenderProps?: HeaderRenderProps[K];
            };
          }[HeaderRender]
        | DefaultHeaderRenderProps<RowData>
    :
        | { headerRender: HeaderRender; headerRenderProps?: unknown }
        | DefaultHeaderRenderProps<RowData>
  : DefaultHeaderRenderProps<RowData>;

export type TableFilterRendersProps<
  FilterRender extends string | undefined = undefined,
  FilterRenderProps extends Record<
    FilterRender extends string ? FilterRender : string,
    unknown
  > = Record<FilterRender extends string ? FilterRender : string, unknown>,
> = FilterRender extends string
  ? FilterRenderProps extends Record<FilterRender, unknown>
    ?
        | {
            [K in FilterRender]: {
              filterRender: K;
              filterRenderProps?: FilterRenderProps[K];
            };
          }[FilterRender]
        | DefaultFilterRenderProps
    : { filterRender: FilterRender; filterRenderProps?: unknown } | DefaultFilterRenderProps
  : DefaultFilterRenderProps;

export type TableSortRendersProps<
  SortRender extends string | undefined = undefined,
  SortRenderProps extends Record<SortRender extends string ? SortRender : string, unknown> = Record<
    SortRender extends string ? SortRender : string,
    unknown
  >,
> = SortRender extends string
  ? SortRenderProps extends Record<SortRender, unknown>
    ?
        | {
            [K in SortRender]: {
              sortRender: K;
              sortRenderProps?: SortRenderProps[K];
            };
          }[SortRender]
        | DefaultSortRenderProps
    : { sortRender: SortRender; sortRenderProps?: unknown } | DefaultSortRenderProps
  : DefaultSortRenderProps;

export type TableCellClassesProps<
  CellClass extends string | undefined = undefined,
  CellClassProps = unknown,
> = {
  cellClass?: (CellClass | TableCellClassKey)[];
  additionalCellClass?: (CellClass | TableCellClassKey)[];
  cellClassProps?: CellClassProps;
};
export type TableHeaderClassesProps<
  HeaderClass extends string | undefined = undefined,
  HeaderClassProps = unknown,
> = {
  headerClass?: (HeaderClass | TableHeaderClassKey)[];
  additionalHeaderClass?: (HeaderClass | TableHeaderClassKey)[];
  headerClassProps?: HeaderClassProps;
};

export type TableDefaultColumnOptions<
  RowData extends DefaultRow,
  CellRender extends string | undefined = undefined,
  CellRenderProps extends Record<CellRender extends string ? CellRender : string, unknown> = Record<
    CellRender extends string ? CellRender : string,
    unknown
  >,
  HeaderRender extends string | undefined = undefined,
  HeaderRenderProps extends Record<
    HeaderRender extends string ? HeaderRender : string,
    unknown
  > = Record<HeaderRender extends string ? HeaderRender : string, unknown>,
  FilterRender extends string | undefined = undefined,
  FilterRenderProps extends Record<
    FilterRender extends string ? FilterRender : string,
    unknown
  > = Record<FilterRender extends string ? FilterRender : string, unknown>,
  SortRender extends string | undefined = undefined,
  SortRenderProps extends Record<SortRender extends string ? SortRender : string, unknown> = Record<
    SortRender extends string ? SortRender : string,
    unknown
  >,
  CellClass extends string | undefined = undefined,
  HeaderClass extends string | undefined = undefined,
  FilterType extends string | undefined = undefined,
  SortType extends string | undefined = undefined,
> = Pick<
  TableColumn<
    RowData,
    CellRender,
    CellRenderProps,
    HeaderRender,
    HeaderRenderProps,
    FilterRender,
    FilterRenderProps,
    SortRender,
    SortRenderProps,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >,
  | "resizable"
  | "expandable"
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
  | "width"
  | "minWidth"
  | "maxWidth"
  | "tooltip"
  | "className"
  | "expandedShift"
>;

export type TableColumnsSettings<
  RowData extends DefaultRow,
  CellRender extends string | undefined = undefined,
  CellRenderProps extends Record<CellRender extends string ? CellRender : string, unknown> = Record<
    CellRender extends string ? CellRender : string,
    unknown
  >,
  HeaderRender extends string | undefined = undefined,
  HeaderRenderProps extends Record<
    HeaderRender extends string ? HeaderRender : string,
    unknown
  > = Record<HeaderRender extends string ? HeaderRender : string, unknown>,
  FilterRender extends string | undefined = undefined,
  FilterRenderProps extends Record<
    FilterRender extends string ? FilterRender : string,
    unknown
  > = Record<FilterRender extends string ? FilterRender : string, unknown>,
  SortRender extends string | undefined = undefined,
  SortRenderProps extends Record<SortRender extends string ? SortRender : string, unknown> = Record<
    SortRender extends string ? SortRender : string,
    unknown
  >,
  CellClass extends string | undefined = undefined,
  CellClassProps = unknown,
  HeaderClass extends string | undefined = undefined,
  HeaderClassProps = unknown,
  FilterType extends string | undefined = undefined,
  SortType extends string | undefined = undefined,
  ColumnProps = unknown,
> = {
  columns: TableColumn<
    RowData,
    CellRender,
    CellRenderProps,
    HeaderRender,
    HeaderRenderProps,
    FilterRender,
    FilterRenderProps,
    SortRender,
    SortRenderProps,
    CellClass,
    CellClassProps,
    HeaderClass,
    HeaderClassProps,
    FilterType,
    SortType,
    ColumnProps
  >[];
  cellRenders?: CellRender extends string
    ? Record<CellRender, (props: { context: CellContext<RowData> }) => ReactNode>
    : undefined;
  headerRenders?: HeaderRender extends string
    ? Record<HeaderRender, (props: { context: HeaderContext<RowData> }) => ReactNode>
    : undefined;
  filterRenders?: FilterRender extends string
    ? Record<FilterRender, (props: ColumnDef<RowData>) => ReactNode>
    : undefined;
  sortRenders?: SortRender extends string
    ? Record<SortRender, (props: { context: HeaderContext<RowData> }) => ReactNode>
    : undefined;
  cellClasses?: CellClass extends string
    ? Record<CellClass, string | ((props: CellContext<RowData>) => string)>
    : undefined;
  headerClasses?: HeaderClass extends string
    ? Record<HeaderClass, string | ((props: HeaderContext<RowData>) => string)>
    : undefined;
  filterTypes?: FilterType extends string ? Record<FilterType, FilterFn<RowData>> : undefined;
  sortTypes?: SortType extends string ? Record<SortType, SortFn<RowData>> : undefined;
  defaultColumnOptions?: TableDefaultColumnOptions<
    RowData,
    CellRender,
    CellRenderProps,
    HeaderRender,
    HeaderRenderProps,
    FilterRender,
    FilterRenderProps,
    SortRender,
    SortRenderProps,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >;
};
