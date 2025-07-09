/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import type {
  DateFilterRenderProps,
  DefaultCellRenderProps,
  DragCellRenderProps,
  SelectCellRenderProps,
  SelectFilterRenderProps,
  SelectHeaderRenderProps,
  TagCellRenderProps,
} from "../components";
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
import type {
  CellClassFn,
  CellContext,
  CellRenderComponent,
  DefaultRow,
  FilterFn,
  FilterRenderComponent,
  HeaderClassFn,
  HeaderRenderComponent,
  SortFn,
  SortRenderComponent,
} from "./utils";

export type TableColumn<
  RowData extends DefaultRow = DefaultRow,
  CellRender extends Record<string, CellRenderComponent<RowData>> = {},
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
  FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
  SortRender extends Record<string, SortRenderComponent<RowData>> = {},
  CellClass extends Record<string, string | CellClassFn<RowData>> = {},
  HeaderClass extends Record<string, string | HeaderClassFn<RowData>> = {},
  FilterType extends Record<string, FilterFn<RowData>> = {},
  SortType extends Record<string, SortFn<RowData>> = {},
> = {
  id?: string;
  key: KeyofDeep<RowData>;
  icon?: ReactNode;
  name: string;
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
  className?: ((context: CellContext<RowData>) => string | undefined) | string;
  sortDirectionFirst?: "asc" | "desc";
  sortType?: keyof SortType | SortingKey;
  filterType?: keyof FilterType | FilterKey;
  props?: unknown;
} & TableCellRendersProps<RowData, CellRender> &
  TableHeaderRendersProps<RowData, HeaderRender> &
  TableFilterRendersProps<RowData, FilterRender> &
  TableSortRendersProps<RowData, SortRender> &
  TableCellClassesProps<RowData, CellClass> &
  TableHeaderClassesProps<RowData, HeaderClass>;

export type ColumnTooltipSettings<RowData extends DefaultRow> = {
  auto?: boolean;
  zIndex?: number;
  pathToContent?: KeyofDeep<RowData>;
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
  | { cellRender?: "drag"; cellRenderProps?: DragCellRenderProps<RowData> }
  | {
      cellRender?: Exclude<TableCellRenderKey, "text" | "tag" | "select" | "drag">;
      cellRenderProps?: never;
    };
export type DefaultHeaderRenderProps =
  | { headerRender?: "select"; headerRenderProps?: SelectHeaderRenderProps }
  | { headerRender?: "default"; headerRenderProps?: unknown }
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
  CellRender extends Record<string, CellRenderComponent<RowData>>,
> =
  | {
      [K in keyof CellRender]: {
        cellRender?: K;
        cellRenderProps?: CellRender[K] extends (args: infer P) => any
          ? P extends { settings: infer S }
            ? S
            : unknown
          : unknown;
      };
    }[keyof CellRender]
  | DefaultTableCellRenderProps<RowData>;

export type TableHeaderRendersProps<
  RowData extends DefaultRow,
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>>,
> =
  | {
      [K in keyof HeaderRender]: {
        headerRender?: K;
        headerRenderProps?: HeaderRender[K] extends (args: infer P) => any
          ? P extends { settings: infer S }
            ? S
            : unknown
          : unknown;
      };
    }[keyof HeaderRender]
  | DefaultHeaderRenderProps;

export type TableFilterRendersProps<
  RowData extends DefaultRow,
  FilterRender extends Record<string, FilterRenderComponent<RowData>>,
> =
  | {
      [K in keyof FilterRender]: {
        filterRender?: K;
        filterRenderProps?: FilterRender[K] extends (args: infer P) => any
          ? P extends { settings: infer S }
            ? S
            : unknown
          : unknown;
      };
    }[keyof FilterRender]
  | DefaultFilterRenderProps;

export type TableSortRendersProps<
  RowData extends DefaultRow,
  SortRender extends Record<string, SortRenderComponent<RowData>>,
> =
  | {
      [K in keyof SortRender]: {
        sortRender?: K;
        sortRenderProps?: SortRender[K] extends (args: infer P) => any
          ? P extends { settings: infer S }
            ? S
            : unknown
          : unknown;
      };
    }[keyof SortRender]
  | DefaultSortRenderProps;

export type TableCellClassesProps<
  RowData extends DefaultRow,
  CellClass extends Record<string, string | CellClassFn<RowData>>,
> = {
  cellClass?: (keyof CellClass | TableCellClassKey)[];
  additionalCellClass?: (keyof CellClass | TableCellClassKey)[];
  cellClassProps?: {
    [K in keyof CellClass]: CellClass[K] extends (context: infer P, settings: infer S) => any
      ? S
      : undefined;
  }[keyof CellClass];
};
export type TableHeaderClassesProps<
  RowData extends DefaultRow,
  HeaderClass extends Record<string, string | HeaderClassFn<RowData>>,
> = {
  headerClass?: (keyof HeaderClass | TableHeaderClassKey)[];
  additionalHeaderClass?: (keyof HeaderClass | TableHeaderClassKey)[];
  headerClassProps?: {
    [K in keyof HeaderClass]: HeaderClass[K] extends (context: infer P, settings: infer S) => any
      ? S
      : undefined;
  }[keyof HeaderClass];
};

export type TableDefaultColumnOptions<
  RowData extends DefaultRow = DefaultRow,
  CellRender extends Record<string, CellRenderComponent<RowData>> = {},
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
  FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
  SortRender extends Record<string, SortRenderComponent<RowData>> = {},
  CellClass extends Record<string, string | CellClassFn<RowData>> = {},
  HeaderClass extends Record<string, string | HeaderClassFn<RowData>> = {},
  FilterType extends Record<string, FilterFn<RowData>> = {},
  SortType extends Record<string, SortFn<RowData>> = {},
> = {
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  draggable?: boolean;
  expandedShift?: number;
  tooltip?: ColumnTooltipSettings<RowData> | boolean;
  sortDirectionFirst?: "asc" | "desc";
  sortType?: keyof SortType | SortingKey;
  filterType?: keyof FilterType | FilterKey;
  cellClass?: (keyof CellClass | TableCellClassKey)[];
  headerClass?: (keyof HeaderClass | TableHeaderClassKey)[];
  cellRender?: keyof CellRender | TableCellRenderKey;
  headerRender?: keyof HeaderRender | TableHeaderRenderKey;
  filterRender?: keyof FilterRender | TableFilterRenderKey;
  sortRender?: keyof SortRender | TableSortRenderKey;
};

export type TableColumnsSettings<
  RowData extends DefaultRow,
  CellRender extends Record<string, CellRenderComponent<RowData>>,
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>>,
  FilterRender extends Record<string, FilterRenderComponent<RowData>>,
  SortRender extends Record<string, SortRenderComponent<RowData>>,
  CellClass extends Record<string, string | CellClassFn<RowData>>,
  HeaderClass extends Record<string, string | HeaderClassFn<RowData>>,
  FilterType extends Record<string, FilterFn<RowData>>,
  SortType extends Record<string, SortFn<RowData>>,
> = {
  columns: TableColumn<
    RowData,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >[];
  cellRenders?: CellRender;
  headerRenders?: HeaderRender;
  filterRenders?: FilterRender;
  sortRenders?: SortRender;
  cellClasses?: CellClass;
  headerClasses?: HeaderClass;
  filterTypes?: FilterType;
  sortTypes?: SortType;
  defaultColumnOptions?: TableDefaultColumnOptions<
    RowData,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >;
};

type IncrementDepth<N extends number, Limit extends number[]> = Limit[N];
export type KeyofDeep<
  T,
  Key extends keyof T = keyof T,
  MaxDepth extends number[] = [1, 2],
  Depth extends number = 0,
> = Depth extends MaxDepth["length"]
  ? never
  : Key extends string
    ? T[Key] extends Record<string, unknown>
      ?
          | `${Key}.${KeyofDeep<T[Key], keyof T[Key], MaxDepth, IncrementDepth<Depth, MaxDepth>>}`
          | `${Key}`
      : T[Key] extends (infer U)[]
        ? U extends Record<string, unknown>
          ?
              | `${Key}[${number}].${KeyofDeep<U, keyof U, MaxDepth, IncrementDepth<Depth, MaxDepth>>}`
              | `${Key}`
          : `${Key}[${number}]` | `${Key}`
        : `${Key}`
    : never;

export type ColumnSizingSettings = Record<
  string,
  { minSize: number | undefined; maxSize: number | undefined }
>;
