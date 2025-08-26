import { type DayJS, dateFormat, isArray, isObject, isString } from "@krainovsd/js-helpers";
import type { FilterFieldType, SelectItemInterface } from "@krainovsd/react-ui";
import type {
  BuiltInFilterFn,
  BuiltInSortingFn,
  ColumnDef,
  ColumnPinningState,
  FilterFnOption,
  GroupingState,
  SortingFn,
} from "@tanstack/react-table";
import React from "react";
import {
  arrayAllFilter,
  arraySort,
  booleanSort,
  dateFilter,
  dateRangeFilter,
  dateSort,
  getData,
  isDayjsDate,
  numberSort,
  stringByArrayFilter,
  stringSort,
} from "..";
import {
  DefaultCellRender,
  DragCellRender,
  SelectCellRender,
  TagCellRender,
} from "../../components/cell-renders";
import {
  DateFilterRender,
  DateRangeFilterRender,
  NumberFilterRender,
  NumberRangeFilterRender,
  SelectFilterRender,
  StringFilterRender,
} from "../../components/filter-renders";
import { DefaultHeaderRender, SelectHeaderRender } from "../../components/header-renders";
import { DoubleArrowSortRender } from "../../components/sort-renders/double-arrow-sort-render";
import { SingleArrowSortRender } from "../../components/sort-renders/single-arrow-sort-render";
import {
  type CellClassInterface,
  type CellRenderComponent,
  type DefaultRow,
  type FilterFn,
  type FilterKey,
  type FilterRenderComponent,
  type HeaderClassInterface,
  type HeaderRenderComponent,
  type SortFn,
  type SortRenderComponent,
  type SortingKey,
  type TableCellClassKey,
  type TableCellClasses,
  type TableCellRenderKey,
  type TableCellRenders,
  type TableColumnsSettings,
  type TableDefaultColumnOptions,
  type TableFilterRenderKey,
  type TableFilterRenders,
  type TableHeaderClassKey,
  type TableHeaderClasses,
  type TableHeaderRenderKey,
  type TableHeaderRenders,
  type TableSortRenderKey,
  type TableSortRenders,
} from "../../types";
import classes from "./classes.module.scss";

const CELL_RENDERS: TableCellRenders<DefaultRow> = {
  select: SelectCellRender,
  tag: TagCellRender,
  default: DefaultCellRender,
  drag: DragCellRender,
  empty: () => "",
};
const HEADER_RENDERS: TableHeaderRenders<DefaultRow> = {
  default: DefaultHeaderRender,
  empty: () => "",
  select: SelectHeaderRender,
};
const FILTER_RENDERS: TableFilterRenders<DefaultRow> = {
  "date-range": DateRangeFilterRender,
  "number-range": NumberRangeFilterRender,
  date: DateFilterRender,
  number: NumberFilterRender,
  string: StringFilterRender,
  select: SelectFilterRender,
};
const SORT_RENDERS: TableSortRenders<DefaultRow> = {
  "double-arrow": DoubleArrowSortRender,
  "single-arrow": SingleArrowSortRender,
};
const CELL_CLASSES: TableCellClasses<DefaultRow> = {
  common: classes.cell__common,
  empty: classes.cell__empty,
  nowrap: classes.cell__nowrap,
  lineClamp: classes.cell__lineClamp,
  hCenter: classes.cell__hCenter,
  wCenter: classes.cell__wCenter,
};
const HEADER_CLASSES: TableHeaderClasses<DefaultRow> = {
  common: classes.header__common,
  empty: classes.header__empty,
  nowrap: classes.header__nowrap,
  lineClamp: classes.header__lineClamp,
  hCenter: classes.header__hCenter,
  wCenter: classes.header__wCenter,
};
const SORTS: Record<SortingKey, SortingFn<DefaultRow> | BuiltInSortingFn> = {
  "string-with-number": "alphanumeric",
  array: arraySort,
  string: stringSort,
  number: numberSort,
  boolean: booleanSort,
  date: dateSort,
};

const FILTERS: Record<FilterKey, FilterFnOption<DefaultRow>> = {
  "date-in-range": dateRangeFilter,
  "array-every-in-array": "arrIncludesAll",
  "array-some-in-array": "arrIncludesSome",
  "array-equals": arrayAllFilter,
  "includes-string": "includesString",
  "array-some-in-primitive": stringByArrayFilter,
  date: dateFilter,
  equals: "equals",
  "number-in-range": "inNumberRange",
};

const DEFAULT_COLUMNS_SETTINGS: TableDefaultColumnOptions<DefaultRow> = {
  cellRender: "default",
  headerRender: "default",
  filterRender: "string",
  sortRender: "double-arrow",
  cellClass: ["common"],
  headerClass: ["common"],
  draggable: true,
  filterable: false,
  resizable: true,
  sortDirectionFirst: "asc",
  sortable: true,
  sortType: "string",
  filterType: "includes-string",
  tooltip: false,
  expandedShift: undefined,
  minWidth: undefined,
  maxWidth: undefined,
};

export function useColumns<
  RowData extends DefaultRow,
  CellRender extends Record<string, CellRenderComponent<RowData>> = {},
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
  FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
  SortRender extends Record<string, SortRenderComponent<RowData>> = {},
  CellClass extends Record<string, CellClassInterface<RowData>> = {},
  HeaderClass extends Record<string, HeaderClassInterface<RowData>> = {},
  FilterType extends Record<string, FilterFn<RowData>> = {},
  SortType extends Record<string, SortFn<RowData>> = {},
>(
  props: TableColumnsSettings<
    RowData,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  > & { withGantt: boolean | undefined; withFilters: boolean; rubberColumn: boolean },
) {
  const { columns, grouping, columnPinning, filterOptions } = React.useMemo(() => {
    const grouping: GroupingState = [];
    const columnPinning: ColumnPinningState = { left: [], right: [] };

    const columns: ColumnDef<RowData>[] = props.columns.map<ColumnDef<RowData>>((column) => {
      const columnId = column.id ?? (column.key as string);

      if (column.leftFrozen) {
        columnPinning.left?.push?.(columnId);
      }
      if (column.rightFrozen) {
        columnPinning.right?.push?.(columnId);
      }
      if (column.grouping) {
        grouping.push(columnId);
      }

      const cellRenderKey =
        column.cellRender?.component ??
        props.defaultColumnOptions?.cellRender ??
        DEFAULT_COLUMNS_SETTINGS.cellRender;
      const headerRenderKey =
        column.headerRender?.component ??
        props.defaultColumnOptions?.headerRender ??
        DEFAULT_COLUMNS_SETTINGS.headerRender;
      const filterRenderKey =
        props.defaultColumnOptions?.filterRender ?? DEFAULT_COLUMNS_SETTINGS.filterRender;
      const sortRenderKey =
        column.sortRender?.component ??
        props.defaultColumnOptions?.sortRender ??
        DEFAULT_COLUMNS_SETTINGS.sortRender;
      const cellClassKey =
        column.cellClass ??
        props.defaultColumnOptions?.cellClass ??
        DEFAULT_COLUMNS_SETTINGS.cellClass;
      const additionalCellClassKey = column.additionalCellClass ?? [];
      const headerClassKey =
        column.headerClass ??
        props.defaultColumnOptions?.headerClass ??
        DEFAULT_COLUMNS_SETTINGS.headerClass;
      const additionalHeaderClassKey = column.additionalHeaderClass ?? [];
      const sortTypeKey =
        column.sortType ??
        props.defaultColumnOptions?.sortType ??
        DEFAULT_COLUMNS_SETTINGS.sortType;
      const filterTypeKey =
        column.filterType ??
        props.defaultColumnOptions?.filterType ??
        DEFAULT_COLUMNS_SETTINGS.filterType;

      const columnDef: ColumnDef<RowData> = {
        accessorKey: column.key as string,
        accessorFn: (row: RowData) => getData(row, column.key),
        id: columnId,
        name: column.name,
        size: column.width,
        minSize:
          column.minWidth ??
          props.defaultColumnOptions?.minWidth ??
          DEFAULT_COLUMNS_SETTINGS.minWidth,
        maxSize:
          column.maxWidth ??
          props.defaultColumnOptions?.maxWidth ??
          DEFAULT_COLUMNS_SETTINGS.maxWidth,
        cellRender:
          (cellRenderKey ? props.cellRenders?.[cellRenderKey] : undefined) ??
          (CELL_RENDERS[cellRenderKey as TableCellRenderKey] as CellRenderComponent<RowData>),
        headerRender:
          (headerRenderKey ? props.headerRenders?.[headerRenderKey] : undefined) ??
          (HEADER_RENDERS[
            headerRenderKey as TableHeaderRenderKey
          ] as HeaderRenderComponent<RowData>),
        filterRender:
          (filterRenderKey ? props.filterRenders?.[filterRenderKey] : undefined) ??
          (FILTER_RENDERS[
            filterRenderKey as TableFilterRenderKey
          ] as FilterRenderComponent<RowData>),
        sortRender:
          (sortRenderKey ? props.sortRenders?.[sortRenderKey] : undefined) ??
          (SORT_RENDERS[sortRenderKey as TableSortRenderKey] as SortRenderComponent<RowData>),
        cellClass: [...(cellClassKey ?? []), ...additionalCellClassKey].reduce(
          (result: CellClassInterface<RowData>[], key) => {
            if (!key) return result;

            const style =
              props.cellClasses?.[key] ??
              (CELL_CLASSES[key as TableCellClassKey] as CellClassInterface<RowData>);

            if (style) result.push(style);

            return result;
          },
          [],
        ),
        headerClass: [...(headerClassKey ?? []), ...additionalHeaderClassKey].reduce(
          (result: HeaderClassInterface<RowData>[], key) => {
            if (!key) return result;

            const style =
              props.headerClasses?.[key] ??
              (HEADER_CLASSES[key as TableHeaderClassKey] as HeaderClassInterface<RowData>);

            if (style) result.push(style);

            return result;
          },
          [],
        ),
        cellRenderProps: column.cellRender?.props,
        headerRenderProps: column.headerRender?.props,
        filterRenderProps: column.filterRender?.props,
        sortRenderProps: column.sortRender?.props,
        cellClassProps: column.cellClassProps,
        headerClassProps: column.headerClassProps,
        props: column.props,
        tooltip: column.tooltip ?? DEFAULT_COLUMNS_SETTINGS.tooltip,
        className: column.className,
        enableResizing: column.rightFrozen
          ? false
          : (column.resizable ?? DEFAULT_COLUMNS_SETTINGS.resizable),
        enableColumnFilter: props.withGantt
          ? false
          : (column.filterable ?? DEFAULT_COLUMNS_SETTINGS.filterable),
        enableSorting: props.withGantt
          ? false
          : (column.sortable ?? DEFAULT_COLUMNS_SETTINGS.sortable),
        enableMultiSort: props.withGantt
          ? false
          : (column.sortable ?? DEFAULT_COLUMNS_SETTINGS.sortable),
        expandable: column.expandable,
        expandedShift: column.expandedShift ?? DEFAULT_COLUMNS_SETTINGS.expandedShift,
        enableHiding: true,
        enablePinning: true,
        enableGrouping: true,
        enableDraggable: column.draggable ?? DEFAULT_COLUMNS_SETTINGS.draggable,
        sortUndefined: 1,
        sortDescFirst:
          (column.sortDirectionFirst ?? DEFAULT_COLUMNS_SETTINGS.sortDirectionFirst) === "desc",
        sortingFn:
          (sortTypeKey ? props.sortTypes?.[sortTypeKey] : undefined) ??
          (SORTS[sortTypeKey as SortingKey] as SortingFn<RowData> | BuiltInSortingFn),
        filterFn:
          (filterTypeKey ? props.filterTypes?.[filterTypeKey] : undefined) ??
          (FILTERS[filterTypeKey as FilterKey] as FilterFn<RowData> | BuiltInFilterFn),
      };

      if (column.width == undefined && props.rubberColumn) {
        columnDef.size = 0;
      }

      return columnDef;
    });

    const filterOptions: FilterFieldType[] = [];
    if (props.withFilters) {
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];

        if (!column.enableColumnFilter || !column.id || typeof column.filterRender !== "function")
          continue;

        filterOptions.push({
          label: column.name,
          name: column.id,
          icon: column.icon as React.JSX.Element,
          labelInValue: true,
          popover: true,
          renderDisplayValue: (value) => {
            const filterRender = props.columns[i].filterRender?.component;

            /** datepicker */
            if (isDayjsDate(value)) {
              const props = column.filterRenderProps;

              if (isObject(props) && isString(props.format))
                return dateFormat(
                  value.toDate(),
                  isObject(props) && isString(props.format) ? props.format : "DD/MM/YYYY",
                );
            }
            /** datepicker range */
            if (isArray(value) && isDayjsDate(value[0])) {
              const props = column.filterRenderProps;

              return value
                .map((val) =>
                  dateFormat(
                    (val as DayJS).toDate(),
                    isObject(props) && isString(props.format) ? props.format : "DD/MM/YYYY",
                  ),
                )
                .join(" - ");
            }

            /** select */
            if (isString(filterRender) && filterRender.includes("select")) {
              const options =
                isObject(column.filterRenderProps) && "options" in column.filterRenderProps
                  ? (column.filterRenderProps?.options as SelectItemInterface[] | undefined)
                  : undefined;
              if (isArray(options)) {
                if (isArray(value)) {
                  return value
                    .map((val) => options.find((opt) => opt.value === val)?.label)
                    .join(", ");
                }

                return options.find((opt) => opt.value === value)?.label ?? "";
              }
            }

            /** range */
            if (isArray(value) && isString(filterRender) && filterRender.includes("range")) {
              // eslint-disable-next-line @typescript-eslint/no-base-to-string
              return value.join(" - ");
            }

            /** array */
            if (isArray(value)) {
              // eslint-disable-next-line @typescript-eslint/no-base-to-string
              return value.join(", ");
            }

            return String(value);
          },
          inputField: column.filterRender({
            context: column,
            settings: column.filterRenderProps,
          }) as React.JSX.Element,
        });
      }
    }

    if (grouping.length > 0) {
      columnPinning.left?.unshift?.(...grouping);
    }

    return { columns, grouping, columnPinning, filterOptions };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.columns,
    props.cellRenders,
    props.headerRenders,
    props.filterRenders,
    props.sortRenders,
    props.sortTypes,
    props.filterTypes,
    props.cellClasses,
    props.headerClasses,
  ]);

  return { columns, grouping, columnPinning, filterOptions };
}
