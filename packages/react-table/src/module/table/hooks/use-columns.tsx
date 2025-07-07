import { type DayJS, dateFormat, isArray, isObject, isString } from "@krainovsd/js-helpers";
import type { FilterFieldType, SelectItemInterface } from "@krainovsd/react-ui";
import type {
  BuiltInSortingFn,
  CellContext,
  ColumnDef,
  ColumnPinningState,
  FilterFnOption,
  GroupingState,
  HeaderContext,
  SortingFn,
} from "@tanstack/react-table";
import React from "react";
import {
  type DefaultRow,
  type FilterKey,
  type SortingKey,
  type TableCellClassKey,
  type TableCellClasses,
  type TableCellRenderKey,
  type TableCellRenders,
  type TableColumnsSettings,
  type TableFilterRenderKey,
  type TableFilterRenders,
  type TableHeaderClassKey,
  type TableHeaderClasses,
  type TableHeaderRenderKey,
  type TableHeaderRenders,
  type TableSortRenderKey,
  type TableSortRenders,
} from "../../../types";
import {
  DateFilterRender,
  DateRangeFilterRender,
  DefaultCellRender,
  DefaultHeaderRender,
  DoubleArrowSortRender,
  NumberFilterRender,
  NumberRangeFilterRender,
  SelectCellRender,
  SelectFilterRender,
  SelectHeaderRender,
  SingleArrowSortRender,
  StringFilterRender,
  TagCellRender,
} from "../components";
import {
  arrayAllFilter,
  arraySort,
  booleanSort,
  dateFilter,
  dateRangeFilter,
  dateSort,
  isDayjsDate,
  numberSort,
  stringByArrayFilter,
  stringSort,
} from "../lib";
import classes from "./classes.module.scss";

export function useColumns<
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
>(
  props: TableColumnsSettings<
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
  > & { withGantt: boolean | undefined; withFilters: boolean; rubberColumn: boolean },
) {
  const {
    cellRender = "default",
    headerRender = "default",
    filterRender = "string",
    sortRender = "double-arrow",
    cellClass = ["common"],
    headerClass = ["common"],
    draggable = true,
    filterable = false,
    resizable = true,
    sortDirectionFirst = "asc",
    sortable = true,
    sortType = "string",
    filterType = "includes-string",
    tooltip = false,
    className = undefined,
    expandable = false,
    expandedShift = 0,
  } = props.defaultColumnOptions ?? {};

  const cellRenders = React.useMemo<TableCellRenders<RowData>>(
    () => ({
      select: SelectCellRender,
      tag: TagCellRender,
      default: DefaultCellRender,
      empty: () => "",
    }),
    [],
  );
  const headerRenders = React.useMemo<TableHeaderRenders<RowData>>(
    () => ({ default: DefaultHeaderRender, select: SelectHeaderRender, empty: () => "" }),
    [],
  );
  const filterRenders = React.useMemo<TableFilterRenders<RowData>>(
    () => ({
      string: StringFilterRender,
      select: SelectFilterRender,
      "date-range": DateRangeFilterRender,
      "number-range": NumberRangeFilterRender,
      date: DateFilterRender,
      number: NumberFilterRender,
    }),
    [],
  );
  const sortRenders = React.useMemo<TableSortRenders<RowData>>(
    () => ({
      "single-arrow": SingleArrowSortRender,
      "double-arrow": DoubleArrowSortRender,
    }),
    [],
  );

  const headerClasses = React.useMemo<TableHeaderClasses<RowData>>(
    () => ({
      common: classes.header__common,
      empty: classes.header__empty,
      nowrap: classes.header__nowrap,
      lineClamp: classes.header__lineClamp,
      hCenter: classes.header__hCenter,
      wCenter: classes.header__wCenter,
    }),
    [],
  );
  const cellClasses = React.useMemo<TableCellClasses<RowData>>(
    () => ({
      common: classes.cell__common,
      empty: classes.cell__empty,
      nowrap: classes.cell__nowrap,
      lineClamp: classes.cell__lineClamp,
      hCenter: classes.cell__hCenter,
      wCenter: classes.cell__wCenter,
    }),
    [],
  );

  const sorts = React.useMemo<Record<SortingKey, SortingFn<RowData> | BuiltInSortingFn>>(
    () => ({
      "string-with-number": "alphanumeric",
      array: arraySort,
      string: stringSort,
      number: numberSort,
      boolean: booleanSort,
      date: dateSort,
    }),
    [],
  );
  const filters = React.useMemo<Record<FilterKey, FilterFnOption<RowData>>>(
    () => ({
      "date-in-range": dateRangeFilter,
      "array-every-in-array": "arrIncludesAll",
      "array-some-in-array": "arrIncludesSome",
      "array-equals": arrayAllFilter,
      "includes-string": "includesString",
      "array-some-in-primitive": stringByArrayFilter,
      date: dateFilter,
      equals: "equals",
      "number-in-range": "inNumberRange",
    }),
    [],
  );

  const { columns, grouping, columnPinning, filterOptions } = React.useMemo(() => {
    const grouping: GroupingState = [];
    const columnPinning: ColumnPinningState = { left: [], right: [] };

    const columns: ColumnDef<RowData>[] = props.columns.map<ColumnDef<RowData>>((column) => {
      if (column.leftFrozen) {
        columnPinning.left?.push?.(column.key as string);
      }
      if (column.rightFrozen) {
        columnPinning.right?.push?.(column.key as string);
      }
      if (column.grouping) {
        grouping.push(column.key as string);
      }

      const cellRenderKey = column.cellRender ?? cellRender;
      const headerRenderKey = column.headerRender ?? headerRender;
      const filterRenderKey = column.filterRender ?? filterRender;
      const sortRenderKey = column.sortRender ?? sortRender;
      const cellClassKey = column.cellClass ?? cellClass;
      const additionalCellClassKey = column.additionalCellClass ?? [];
      const headerClassKey = column.headerClass ?? headerClass;
      const additionalHeaderClassKey = column.additionalHeaderClass ?? [];
      const sortTypeKey = column.sortType ?? sortType;
      const filterTypeKey = column.filterType ?? filterType;

      const columnDef: ColumnDef<RowData> = {
        renderKey: column.renderKey ?? (column.key as string),
        accessorKey: column.key,
        id: column.key as string,
        name: column.name,
        cellRender:
          props.cellRenders?.[cellRenderKey] ?? cellRenders[cellRenderKey as TableCellRenderKey],
        headerRender:
          props.headerRenders?.[headerRenderKey] ??
          headerRenders[headerRenderKey as TableHeaderRenderKey],
        filterRender:
          props.filterRenders?.[filterRenderKey] ??
          filterRenders[filterRenderKey as TableFilterRenderKey],
        sortRender:
          props.sortRenders?.[sortRenderKey] ?? sortRenders[sortRenderKey as TableSortRenderKey],
        cellClass: [...cellClassKey, ...additionalCellClassKey].reduce(
          (result: (string | ((props: CellContext<RowData, unknown>) => string))[], key) => {
            if (!key) return result;

            const style = props.cellClasses?.[key] ?? cellClasses[key as TableCellClassKey];

            if (style) result.push(style);

            return result;
          },
          [],
        ),
        headerClass: [...headerClassKey, ...additionalHeaderClassKey].reduce(
          (result: (string | ((props: HeaderContext<RowData, unknown>) => string))[], key) => {
            if (!key) return result;

            const style = props.headerClasses?.[key] ?? headerClasses[key as TableHeaderClassKey];

            if (style) result.push(style);

            return result;
          },
          [],
        ),
        cellRenderProps: column.cellRenderProps,
        headerRenderProps: column.headerRenderProps,
        filterRenderProps: column.filterRenderProps,
        sortRenderProps: column.sortRenderProps,
        props: column.props,
        tooltip: column.tooltip ?? tooltip,
        className: column.className ?? className,
        enableResizing: column.rightFrozen ? false : (column.resizable ?? resizable),
        enableColumnFilter: props.withGantt ? false : (column.filterable ?? filterable),
        enableSorting: props.withGantt ? false : (column.sortable ?? sortable),
        enableMultiSort: props.withGantt ? false : (column.sortable ?? sortable),
        expandable: column.expandable ?? expandable,
        expandedShift: column.expandedShift ?? expandedShift,
        enableHiding: true,
        enablePinning: true,
        enableGrouping: true,
        enableDraggable: column.draggable ?? draggable,
        sortUndefined: 1,
        sortDescFirst: (column.sortDirectionFirst ?? sortDirectionFirst) === "desc",
        sortingFn: props.sortTypes?.[sortTypeKey] ?? sorts[sortTypeKey as SortingKey],
        filterFn: props.filterTypes?.[filterTypeKey] ?? filters[filterTypeKey as FilterKey],
      };

      if (column.width != undefined) {
        columnDef.size = column.width;
      }

      if (column.width == undefined && props.rubberColumn) {
        columnDef.minSize = 0;
        columnDef.size = 0;
      }
      if (column.minWidth != undefined) {
        columnDef.minSize = column.minWidth;
      }
      if (column.maxWidth != undefined) {
        columnDef.maxSize = column.maxWidth;
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
            const filterRender = props.columns[i].filterRender;

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
          inputField: column.filterRender(column) as React.JSX.Element,
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
