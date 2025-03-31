import { type DayJS, dateFormat, isArray, isObject, isString } from "@krainovsd/js-helpers";
import type { FilterFieldType } from "@krainovsd/react-ui";
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
  CommonHeaderRender,
  DateCellRender,
  DateFilterRender,
  DateRangeFilterRender,
  DoubleArrowSortRender,
  NumberFilterRender,
  NumberRangeFilterRender,
  SelectFilterRender,
  SingleArrowSortRender,
  StringFilterRender,
  TextCellRender,
} from "../components";
import {
  arraySort,
  booleanSort,
  dateFilter,
  dateRangeFilter,
  dateSort,
  isDayjsDate,
  numberSort,
  stringSort,
} from "../lib";
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
} from "../types";
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
  >,
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
    filterType = "arrIncludes",
  } = props.defaultColumnOptions ?? {};

  const cellRenders = React.useMemo<TableCellRenders<Row>>(
    () => ({
      date: DateCellRender,
      text: TextCellRender,
      empty: () => "",
    }),
    [],
  );
  const headerRenders = React.useMemo<TableHeaderRenders<Row>>(
    () => ({ common: CommonHeaderRender }),
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
    }),
    [],
  );
  const cellClasses = React.useMemo<TableCellClasses<Row>>(
    () => ({
      common: classes.cell__common,
      empty: classes.cell__empty,
      nowrap: classes.cell_nowrap,
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
      "includes-array": "arrIncludes",
      "includes-array-all": "arrIncludesAll",
      "includes-string": "includesString",
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

      return {
        accessorKey: column.key,
        id: column.key,
        name: column.name,
        size: column.width,
        maxSize: column.maxWidth,
        minSize: column.minWidth,
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
        enableColumnFilter: column.filterable ?? filterable,
        enableSorting: column.sortable ?? sortable,
        enableMultiSort: column.sortable ?? sortable,
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
    });

    const filterOptions: FilterFieldType[] = [];
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (!column.enableColumnFilter || !column.id) continue;

      filterOptions.push({
        label: column.name,
        name: column.id,
        icon: column.icon as React.JSX.Element,
        labelInValue: true,
        renderDisplayValue: (value) => {
          const filterKey = props.columns[i].filterType;

          if (isDayjsDate(value)) {
            const props = column.filterRenderProps;

            if (isObject(props) && isString(props.format))
              return dateFormat(
                value.toDate(),
                isObject(props) && isString(props.format) ? props.format : "DD/MM/YYYY",
              );
          }

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

          if (isArray(value) && isString(filterKey) && filterKey.includes("range")) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            return value.join(" - ");
          }
          if (isArray(value)) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            return value.join(", ");
          }

          return String(value);
        },
        inputField: column.filterRender(column) as React.JSX.Element,
      });
    }

    if (grouping.length > 0) {
      columnPinning.left?.unshift?.(...grouping);
    }

    return { columns, grouping, columnPinning, filterOptions };
  }, [
    props.columns,
    props.cellClasses,
    props.headerClasses,
    props.cellRenders,
    props.headerRenders,
    props.filterRenders,
    props.sortRenders,
  ]);

  return { columns, grouping, columnPinning, filterOptions };
}
