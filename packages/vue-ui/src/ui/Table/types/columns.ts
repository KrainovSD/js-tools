/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";
import type { Component } from "vue";
import type { FilterComponentKey } from "../../Filter.vue";
import type {
  DateFilterRenderProps,
  DefaultCellRenderProps,
  DragCellRenderProps,
  NumberFilterRenderProps,
  NumberRangeFilterRenderProps,
  SelectCellRenderProps,
  SelectFilterRenderProps,
  StringFilterRenderProps,
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
  CellClassInterface,
  CellContext,
  CellRenderComponent,
  DefaultRow,
  FilterFn,
  FilterRenderComponent,
  HeaderClassInterface,
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
  CellClass extends Record<string, CellClassInterface<RowData>> = {},
  HeaderClass extends Record<string, HeaderClassInterface<RowData>> = {},
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

  cellRender?: TableCellRendersProps<RowData, CellRender>;
  headerRender?: TableHeaderRendersProps<RowData, HeaderRender>;
  filterRender?:
    | TableFilterRendersProps<RowData, FilterRender, FilterType>[]
    | TableFilterRendersProps<RowData, FilterRender, FilterType>;
  sortRender?: TableSortRendersProps<RowData, SortRender>;
  headerClass?: (keyof HeaderClass | TableHeaderClassKey)[];
  additionalHeaderClass?: (keyof HeaderClass | TableHeaderClassKey)[];
  cellClass?: (keyof CellClass | TableCellClassKey)[];
  additionalCellClass?: (keyof CellClass | TableCellClassKey)[];

  headerClassProps?: {
    [K in keyof HeaderClass]: FnSettings<HeaderClass[K]>;
  }[keyof HeaderClass];
  cellClassProps?: {
    [K in keyof CellClass]: FnSettings<CellClass[K]>;
  }[keyof CellClass];
};

export type ColumnTooltipSettings<RowData extends DefaultRow> = {
  auto?: boolean;
  zIndex?: number;
  pathToContent?: KeyofDeep<RowData>;
  customContent?: (row: RowData) => string;
  arraySeparator?: string;
};

export type DefaultTableCellRenderProps<RowData extends DefaultRow> =
  | {
      component?: "default";
      props?: DefaultCellRenderProps<RowData>;
    }
  | { component?: "tag"; props?: TagCellRenderProps }
  | { component?: "select"; props?: SelectCellRenderProps }
  | { component?: "drag"; props?: DragCellRenderProps<RowData> }
  | {
      component?: Exclude<TableCellRenderKey, "default" | "tag" | "select" | "drag">;
      props?: never;
    };
export type DefaultHeaderRenderProps = {
  component?: TableHeaderRenderKey;
  props?: never;
};

export type FilterOperator<
  RowData extends DefaultRow,
  FilterType extends Record<string, FilterFn<RowData>> = {},
> = {
  value: keyof FilterType | FilterKey;
  label: string;
  desc?: Component;
};

export type DefaultFilterRenderProps<
  RowData extends DefaultRow,
  FilterType extends Record<string, FilterFn<RowData>> = {},
> =
  | {
      component?: "string";
      props?: StringFilterRenderProps;
      operatorValue?: keyof FilterType | FilterKey;
      operatorLabel?: string;
      displayValue?: FilterComponentKey;
    }
  | {
      component?: "number";
      props?: NumberFilterRenderProps;
      operatorValue?: keyof FilterType | FilterKey;
      operatorLabel?: string;
      displayValue?: FilterComponentKey;
    }
  | {
      component?: "number-range";
      props?: NumberRangeFilterRenderProps;
      operatorValue?: keyof FilterType | FilterKey;
      operatorLabel?: string;
      displayValue?: FilterComponentKey;
    }
  | {
      component?: "select";
      props?: SelectFilterRenderProps;
      operatorValue?: keyof FilterType | FilterKey;
      operatorLabel?: string;
      displayValue?: FilterComponentKey;
    }
  | {
      component?: "date";
      props?: DateFilterRenderProps;
      operatorValue?: keyof FilterType | FilterKey;
      operatorLabel?: string;
      displayValue?: FilterComponentKey;
    }
  | {
      component?: "date-range";
      props?: DateFilterRenderProps;
      operatorValue?: keyof FilterType | FilterKey;
      operatorLabel?: string;
      displayValue?: FilterComponentKey;
    };

export type DefaultSortRenderProps = { component?: TableSortRenderKey; props?: never };

export type CellRenderMap<
  RowData extends DefaultRow,
  CellRender extends Record<string, CellRenderComponent<RowData>>,
> = {
  [K in keyof CellRender]: {
    component?: K;
    props?: ComponentProps<CellRender[K]>;
  };
}[keyof CellRender];

export type TableCellRendersProps<
  RowData extends DefaultRow,
  CellRender extends Record<string, CellRenderComponent<RowData>> = {},
> = CellRenderMap<RowData, CellRender> | DefaultTableCellRenderProps<RowData>;

export type HeaderRenderMap<
  RowData extends DefaultRow,
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>>,
> = {
  [K in keyof HeaderRender]: {
    component?: K;
    props?: ComponentProps<HeaderRender[K]>;
  };
}[keyof HeaderRender];

export type TableHeaderRendersProps<
  RowData extends DefaultRow,
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
> = HeaderRenderMap<RowData, HeaderRender> | DefaultHeaderRenderProps;

export type FilterRenderMap<
  RowData extends DefaultRow,
  FilterRender extends Record<string, FilterRenderComponent<RowData>>,
  FilterType extends Record<string, FilterFn<RowData>> = {},
> = {
  [K in keyof FilterRender]: {
    component?: K;
    props?: ComponentProps<FilterRender[K]>;
    operatorValue?: keyof FilterType | FilterKey;
    operatorLabel?: string;
    displayValue?: FilterComponentKey;
  };
}[keyof FilterRender];

export type TableFilterRendersProps<
  RowData extends DefaultRow,
  FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
  FilterType extends Record<string, FilterFn<RowData>> = {},
> =
  | FilterRenderMap<RowData, FilterRender, FilterType>
  | DefaultFilterRenderProps<RowData, FilterType>;

type ComponentProps<T> = T extends (args: infer P extends Record<string, any>) => any
  ? P["settings"]
  : unknown;
type FnSettings<T> = T extends (context: infer P, settings: infer S) => any ? S : undefined;

export type SortRenderMap<
  RowData extends DefaultRow,
  SortRender extends Record<string, SortRenderComponent<RowData>>,
> = {
  [K in keyof SortRender]: {
    component?: K;
    props?: ComponentProps<SortRender[K]>;
  };
}[keyof SortRender];

export type TableSortRendersProps<
  RowData extends DefaultRow,
  SortRender extends Record<string, SortRenderComponent<RowData>> = {},
> = SortRenderMap<RowData, SortRender> | DefaultSortRenderProps;

export type TableCellClassesMap<
  RowData extends DefaultRow,
  CellClass extends Record<string, CellClassInterface<RowData>>,
> = {
  cellClassProps?: {
    [K in keyof CellClass]: FnSettings<CellClass[K]>;
  }[keyof CellClass];
};

export type TableCellClassesProps<
  RowData extends DefaultRow,
  CellClass extends Record<string, CellClassInterface<RowData>> = {},
> = {
  cellClass?: (keyof CellClass | TableCellClassKey)[];
  additionalCellClass?: (keyof CellClass | TableCellClassKey)[];
  cellClassProps?: TableCellClassesMap<RowData, CellClass>;
};

export type TableHeaderClassesMap<
  RowData extends DefaultRow,
  HeaderClass extends Record<string, HeaderClassInterface<RowData>>,
> = {
  headerClassProps?: {
    [K in keyof HeaderClass]: FnSettings<HeaderClass[K]>;
  }[keyof HeaderClass];
};

export type TableHeaderClassesProps<
  RowData extends DefaultRow,
  HeaderClass extends Record<string, HeaderClassInterface<RowData>> = {},
> = {
  headerClass?: (keyof HeaderClass | TableHeaderClassKey)[];
  additionalHeaderClass?: (keyof HeaderClass | TableHeaderClassKey)[];
  headerClassProps?: TableHeaderClassesMap<RowData, HeaderClass>;
};

export type TableDefaultColumnOptions<
  RowData extends DefaultRow = DefaultRow,
  CellRender extends Record<string, CellRenderComponent<RowData>> = {},
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
  FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
  SortRender extends Record<string, SortRenderComponent<RowData>> = {},
  CellClass extends Record<string, CellClassInterface<RowData>> = {},
  HeaderClass extends Record<string, HeaderClassInterface<RowData>> = {},
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
  CellClass extends Record<string, CellClassInterface<RowData>>,
  HeaderClass extends Record<string, HeaderClassInterface<RowData>>,
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
