import { getByPath } from "@krainovsd/js-helpers";
import type { BuiltInSortingFn } from "@tanstack/vue-table";
import type { SortingFn } from "@tanstack/vue-table";
import type { FilterFnOption } from "@tanstack/vue-table";
import type { GroupingState } from "@tanstack/vue-table";
import type { ColumnPinningState } from "@tanstack/vue-table";
import { effect, shallowRef } from "vue";
import {
  DateFilterRender,
  DateRangeFilterRender,
  DefaultCellRender,
  DefaultHeaderRender,
  DoubleSortRender,
  DragCellRender,
  EmptyCellRender,
  EmptyHeaderRender,
  NumberFilterRender,
  NumberRangeFilterRender,
  SelectCellRender,
  SelectFilterRender,
  SelectHeaderRender,
  SingleSortRender,
  StringFilterRender,
  TagCellRender,
} from "../../components";
import type {
  CellClassInterface,
  CellRenderComponent,
  ColumnDef,
  DefaultRow,
  FilterFn,
  FilterKey,
  FilterRenderComponent,
  HeaderClassInterface,
  HeaderRenderComponent,
  SortFn,
  SortRenderComponent,
  SortingKey,
  TableCellClassKey,
  TableCellClasses,
  TableCellRenderKey,
  TableCellRenders,
  TableColumnsSettings,
  TableFilterRenderKey,
  TableFilterRenders,
  TableHeaderClassKey,
  TableHeaderClasses,
  TableHeaderRenderKey,
  TableHeaderRenders,
  TableSortRenderKey,
  TableSortRenders,
} from "../../types";
import { arrayAllFilter, dateFilter, dateRangeFilter, stringByArrayFilter } from "../filtering";
import { arraySort, booleanSort, dateSort, numberSort, stringSort } from "../sorting";

const CELL_RENDERS: TableCellRenders<DefaultRow> = {
  select: SelectCellRender,
  tag: TagCellRender,
  default: DefaultCellRender,
  empty: EmptyCellRender,
  drag: DragCellRender,
};
const HEADER_RENDERS: TableHeaderRenders<DefaultRow> = {
  default: DefaultHeaderRender,
  empty: EmptyHeaderRender,
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
  "double-arrow": DoubleSortRender,
  "single-arrow": SingleSortRender,
};
const CELL_CLASSES: TableCellClasses<DefaultRow> = {
  common: "ksd-table-cell__common",
  empty: "ksd-table-cell__empty",
  hCenter: "ksd-table-cell__hCenter",
  lineClamp: "ksd-table-cell__lineClamp",
  nowrap: "ksd-table-cell__nowrap",
  wCenter: "ksd-table-cell__wCenter",
};
const HEADER_CLASSES: TableHeaderClasses<DefaultRow> = {
  common: "ksd-table-header-cell__common",
  empty: "ksd-table-header-cell__empty",
  hCenter: "ksd-table-header-cell__hCenter",
  lineClamp: "ksd-table-header-cell__lineClamp",
  nowrap: "ksd-table-header-cell__nowrap",
  wCenter: "ksd-table-header-cell__wCenter",
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
    expandedShift = undefined,
    minWidth = undefined,
    maxWidth = undefined,
  } = props.defaultColumnOptions ?? {};

  const initialColumns = shallowRef<ColumnDef<RowData>[]>([]);
  const initialColumnPinning = shallowRef<ColumnPinningState>();
  const initialGrouping = shallowRef<GroupingState>([]);

  effect(() => {
    const newGrouped: GroupingState = [];
    const newPinned: ColumnPinningState = { left: [], right: [] };

    const newColumns: ColumnDef<RowData>[] = props.columns.map<ColumnDef<RowData>>((column) => {
      const columnId = column.id ?? (column.key as string);

      if (column.leftFrozen) {
        newPinned.left?.push?.(columnId);
      }
      if (column.rightFrozen) {
        newPinned.right?.push?.(columnId);
      }
      if (column.grouping) {
        newGrouped.push(columnId);
      }

      const cellRenderKey = column.cellRender.component ?? cellRender;
      const headerRenderKey = column.headerRender.component ?? headerRender;
      const filterRenderKey = column.filterRender.component ?? filterRender;
      const sortRenderKey = column.sortRender.component ?? sortRender;
      const cellClassKey = column.cellClass ?? cellClass;
      const additionalCellClassKey = column.additionalCellClass ?? [];
      const headerClassKey = column.headerClass ?? headerClass;
      const additionalHeaderClassKey = column.additionalHeaderClass ?? [];
      const sortTypeKey = column.sortType ?? sortType;
      const filterTypeKey = column.filterType ?? filterType;

      const columnDef: ColumnDef<RowData> = {
        accessorKey: column.key as string,
        accessorFn: (row: RowData) => getByPath(row, column.key),
        id: columnId,
        name: column.name,
        size: column.width,
        minSize: column.minWidth ?? minWidth,
        maxSize: column.maxWidth ?? maxWidth,
        cellRender:
          props.cellRenders?.[cellRenderKey] ??
          (CELL_RENDERS[cellRenderKey as TableCellRenderKey] as CellRenderComponent<RowData>),
        headerRender:
          props.headerRenders?.[headerRenderKey] ??
          (HEADER_RENDERS[
            headerRenderKey as TableHeaderRenderKey
          ] as HeaderRenderComponent<RowData>),
        filterRender:
          props.filterRenders?.[filterRenderKey] ??
          (FILTER_RENDERS[
            filterRenderKey as TableFilterRenderKey
          ] as FilterRenderComponent<RowData>),
        sortRender:
          props.sortRenders?.[sortRenderKey] ??
          (SORT_RENDERS[sortRenderKey as TableSortRenderKey] as SortRenderComponent<RowData>),
        cellClass: [...cellClassKey, ...additionalCellClassKey].reduce(
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
        headerClass: [...headerClassKey, ...additionalHeaderClassKey].reduce(
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
        cellRenderProps: column.cellRender.props,
        headerRenderProps: column.headerRender.props,
        filterRenderProps: column.filterRender.props,
        sortRenderProps: column.sortRender.props,
        props: column.props,
        tooltip: column.tooltip ?? tooltip,
        className: column.className,
        enableResizing: column.rightFrozen ? false : (column.resizable ?? resizable),
        enableColumnFilter: props.withGantt ? false : (column.filterable ?? filterable),
        enableSorting: props.withGantt ? false : (column.sortable ?? sortable),
        enableMultiSort: props.withGantt ? false : (column.sortable ?? sortable),
        expandable: column.expandable,
        expandedShift: column.expandedShift ?? expandedShift,
        enableHiding: true,
        enablePinning: true,
        enableGrouping: true,
        enableDraggable: column.draggable ?? draggable,
        sortUndefined: 1,
        sortDescFirst: (column.sortDirectionFirst ?? sortDirectionFirst) === "desc",
        sortingFn:
          props.sortTypes?.[sortTypeKey] ??
          (SORTS[sortTypeKey as SortingKey] as SortingFn<RowData> | BuiltInSortingFn),
        filterFn:
          props.filterTypes?.[filterTypeKey] ??
          (FILTERS[filterTypeKey as FilterKey] as FilterFnOption<RowData>),
      };

      if (column.width == undefined && props.rubberColumn) {
        columnDef.size = 0;
      }

      return columnDef;
    });

    if (newGrouped.length > 0) {
      newPinned.left?.unshift?.(...newGrouped);
    }

    initialColumns.value = newColumns;
    initialColumnPinning.value = newPinned;
    initialGrouping.value = newGrouped;
  });

  return { initialColumns, initialColumnPinning, initialGrouping };
}
