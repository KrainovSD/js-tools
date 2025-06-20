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
  CommonHeaderRender,
  DateCellRender,
  DateFilterRender,
  DateRangeFilterRender,
  DoubleArrowSortRender,
  NumberFilterRender,
  NumberRangeFilterRender,
  SelectCellRender,
  SelectFilterRender,
  SelectHeaderRender,
  SingleArrowSortRender,
  StringFilterRender,
  TagCellRender,
  TextCellRender,
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
  Row extends Record<string, unknown>,
  CellRender = undefined,
  HeaderRender = undefined,
  FilterRender = undefined,
  SortRender = undefined,
  CellClass = undefined,
  HeaderClass = undefined,
  FilterType = undefined,
  SortType = undefined,
>(
  props: TableColumnsSettings<
    Row,
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
  const {
    cellRender = "text",
    headerRender = "common",
    filterRender = "string",
    sortRender = "double-arrow",
    cellClass = ["common", "empty"],
    headerClass = ["common"],
    draggable = true,
    filterable = false,
    resizable = true,
    sortDirectionFirst = "asc",
    sortable = true,
    sortType = "string",
    filterType = "includes-string",
  } = props.defaultColumnOptions ?? {};

  const cellRenders = React.useMemo<TableCellRenders<Row>>(
    () => ({
      select: SelectCellRender,
      date: DateCellRender,
      text: TextCellRender,
      tag: TagCellRender,
      empty: () => "",
    }),
    [],
  );
  const headerRenders = React.useMemo<TableHeaderRenders<Row>>(
    () => ({ common: CommonHeaderRender, select: SelectHeaderRender, empty: () => "" }),
    [],
  );
  const filterRenders = React.useMemo<TableFilterRenders<Row>>(
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
  const sortRenders = React.useMemo<TableSortRenders<Row>>(
    () => ({
      "single-arrow": SingleArrowSortRender,
      "double-arrow": DoubleArrowSortRender,
    }),
    [],
  );

  const headerClasses = React.useMemo<TableHeaderClasses<Row>>(
    () => ({
      common: classes.header__common,
      empty: classes.header__empty,
      nowrap: classes.header__nowrap,
      lineClamp: classes.header__lineClamp,
    }),
    [],
  );
  const cellClasses = React.useMemo<TableCellClasses<Row>>(
    () => ({
      common: classes.cell__common,
      empty: classes.cell__empty,
      nowrap: classes.cell__nowrap,
      lineClamp: classes.cell__lineClamp,
    }),
    [],
  );

  const sorts = React.useMemo<Record<SortingKey, SortingFn<Row> | BuiltInSortingFn>>(
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
  const filters = React.useMemo<Record<FilterKey, FilterFnOption<Row>>>(
    () => ({
      "date-in-range": dateRangeFilter,
      "includes-array-every": "arrIncludesAll",
      "includes-array-some": "arrIncludesSome",
      "includes-array-all": arrayAllFilter,
      "includes-string": "includesString",
      "includes-string-one-of-array": stringByArrayFilter,
      date: dateFilter,
      equals: "equals",
      "number-in-range": "inNumberRange",
    }),
    [],
  );

  const { columns, grouping, columnPinning, filterOptions } = React.useMemo(() => {
    const grouping: GroupingState = [];
    const columnPinning: ColumnPinningState = { left: [], right: [] };

    const columns: ColumnDef<Row>[] = props.columns.map<ColumnDef<Row>>((column) => {
      if (column.leftFrozen) {
        columnPinning.left?.push?.(column.key);
      }
      if (column.rightFrozen) {
        columnPinning.right?.push?.(column.key);
      }
      if (column.grouping) {
        grouping.push(column.key);
      }

      const cellRenderKey = column.cellRender ?? cellRender;
      const headerRenderKey = column.headerRender ?? headerRender;
      const filterRenderKey = column.filterRender ?? filterRender;
      const sortRenderKey = column.sortRender ?? sortRender;
      const cellClassKey = column.cellClass ?? cellClass;
      const headerClassKey = column.headerClass ?? headerClass;
      const sortTypeKey = column.sortType ?? sortType;
      const filterTypeKey = column.filterType ?? filterType;

      const columnDef: ColumnDef<Row> = {
        accessorKey: column.key,
        id: column.key,
        name: column.name,
        cellRender:
          props.cellRenders?.[cellRenderKey as CellRender] ??
          cellRenders[cellRenderKey as TableCellRenderKey],
        headerRender:
          props.headerRenders?.[headerRenderKey as HeaderRender] ??
          headerRenders[headerRenderKey as TableHeaderRenderKey],
        filterRender:
          props.filterRenders?.[filterRenderKey as FilterRender] ??
          filterRenders[filterRenderKey as TableFilterRenderKey],
        sortRender:
          props.sortRenders?.[sortRenderKey as SortRender] ??
          sortRenders[sortRenderKey as TableSortRenderKey],
        cellClass: cellClassKey.reduce(
          (result: (string | ((props: CellContext<Row, unknown>) => string))[], key) => {
            const style =
              props.cellClasses?.[key as CellClass] ?? cellClasses[key as TableCellClassKey];

            if (style) result.push(style);

            return result;
          },
          [],
        ),
        headerClass: headerClassKey.reduce(
          (result: (string | ((props: HeaderContext<Row, unknown>) => string))[], key) => {
            const style =
              props.headerClasses?.[key as HeaderClass] ??
              headerClasses[key as TableHeaderClassKey];

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

        enableResizing: column.rightFrozen ? false : (column.resizable ?? resizable),
        enableColumnFilter: props.withGantt ? false : (column.filterable ?? filterable),
        enableSorting: props.withGantt ? false : (column.sortable ?? sortable),
        enableMultiSort: props.withGantt ? false : (column.sortable ?? sortable),
        enableHiding: true,
        enablePinning: true,
        enableGrouping: true,
        enableDraggable: column.draggable ?? draggable,
        sortUndefined: 1,
        sortDescFirst: (column.sortDirectionFirst ?? sortDirectionFirst) === "desc",
        sortingFn: props.sortTypes?.[sortTypeKey as SortType] ?? sorts[sortTypeKey],
        filterFn:
          props.filterTypes?.[filterTypeKey as FilterType] ?? filters[filterTypeKey as FilterKey],
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
