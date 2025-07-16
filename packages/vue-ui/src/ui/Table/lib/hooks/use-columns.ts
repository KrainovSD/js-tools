import { getByPath } from "@krainovsd/js-helpers";
import type {
  BuiltInSortingFn,
  ColumnPinningState,
  FilterFnOption,
  GroupingState,
  SortingFn,
} from "@tanstack/vue-table";
import { computed } from "vue";
import type { SelectItem } from "../../../Select.vue";
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
  DefaultGanttData,
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
  TableDefaultColumnOptions,
  TableFilterRenderKey,
  TableFilterRenders,
  TableHeaderClassKey,
  TableHeaderClasses,
  TableHeaderRenderKey,
  TableHeaderRenders,
  TableProps,
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
  common: "common",
  empty: "empty",
  hCenter: "hCenter",
  lineClamp: "lineClamp",
  nowrap: "nowrap",
  wCenter: "wCenter",
};
const HEADER_CLASSES: TableHeaderClasses<DefaultRow> = {
  common: "common",
  empty: "empty",
  hCenter: "hCenter",
  lineClamp: "lineClamp",
  nowrap: "nowrap",
  wCenter: "wCenter",
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

const DEFAULT_COLUMNS_SETTINGS: TableDefaultColumnOptions = {
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
  GanttData extends DefaultGanttData,
  CellRender extends Record<string, CellRenderComponent<RowData>>,
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>>,
  FilterRender extends Record<string, FilterRenderComponent<RowData>>,
  SortRender extends Record<string, SortRenderComponent<RowData>>,
  CellClass extends Record<string, CellClassInterface<RowData>>,
  HeaderClass extends Record<string, HeaderClassInterface<RowData>>,
  FilterType extends Record<string, FilterFn<RowData>>,
  SortType extends Record<string, SortFn<RowData>>,
>(
  props: TableProps<
    RowData,
    GanttData,
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
  const columnsDef = computed(() => {
    return props.columns.map<ColumnDef<RowData>>((column) => {
      const columnId = column.id ?? (column.key as string);

      const cellRenderKey =
        column.cellRender?.component ??
        props.defaultColumnOptions?.cellRender ??
        DEFAULT_COLUMNS_SETTINGS.cellRender;
      const headerRenderKey =
        column.headerRender?.component ??
        props.defaultColumnOptions?.headerRender ??
        DEFAULT_COLUMNS_SETTINGS.headerRender;
      const filterRenderKey =
        column.filterRender?.component ??
        props.defaultColumnOptions?.filterRender ??
        DEFAULT_COLUMNS_SETTINGS.filterRender;
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
        accessorFn: (row: RowData) => getByPath(row, column.key),
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
        filterOperators: (column.filterRender?.operators as SelectItem[]) ?? [],
        sortRenderProps: column.sortRender?.props,
        cellClassProps: column.cellClassProps,
        headerClassProps: column.headerClassProps,
        props: column.props,
        tooltip:
          column.tooltip ?? props.defaultColumnOptions?.tooltip ?? DEFAULT_COLUMNS_SETTINGS.tooltip,
        className: column.className,
        enableResizing: column.rightFrozen
          ? false
          : (column.resizable ??
            props.defaultColumnOptions?.resizable ??
            DEFAULT_COLUMNS_SETTINGS.resizable),
        enableColumnFilter: props.withGantt
          ? false
          : (column.filterable ??
            props.defaultColumnOptions?.filterable ??
            DEFAULT_COLUMNS_SETTINGS.filterable),
        enableSorting: props.withGantt
          ? false
          : (column.sortable ??
            props.defaultColumnOptions?.sortable ??
            DEFAULT_COLUMNS_SETTINGS.sortable),
        enableMultiSort: props.withGantt
          ? false
          : (column.sortable ??
            props.defaultColumnOptions?.sortable ??
            DEFAULT_COLUMNS_SETTINGS.sortable),
        expandable: column.expandable,
        expandedShift:
          column.expandedShift ??
          props.defaultColumnOptions?.expandedShift ??
          DEFAULT_COLUMNS_SETTINGS.expandedShift,
        enableHiding: true,
        enablePinning: true,
        enableGrouping: true,
        enableDraggable:
          column.draggable ??
          props.defaultColumnOptions?.draggable ??
          DEFAULT_COLUMNS_SETTINGS.draggable,
        sortUndefined: 1,
        sortDescFirst:
          (column.sortDirectionFirst ??
            props.defaultColumnOptions?.sortDirectionFirst ??
            DEFAULT_COLUMNS_SETTINGS.sortDirectionFirst) === "desc",
        sortingFn:
          (sortTypeKey ? props.sortTypes?.[sortTypeKey] : undefined) ??
          (SORTS[sortTypeKey as SortingKey] as SortingFn<RowData> | BuiltInSortingFn),
        filterFn:
          (filterTypeKey ? props.filterTypes?.[filterTypeKey] : undefined) ??
          (FILTERS[filterTypeKey as FilterKey] as FilterFnOption<RowData>),
      };

      if (column.width == undefined && props.rubberColumn) {
        columnDef.size = 0;
      }

      return columnDef;
    });
  });
  const initialState = computed(() => {
    const columnPinning: ColumnPinningState = { left: [], right: [] };
    const grouping: GroupingState = [];

    for (let i = 0; i < props.columns.length; i++) {
      const column = props.columns[i];
      const columnId = column.id ?? (column.key as string);

      if (column.grouping) {
        grouping.push(columnId);
      } else {
        if (column.leftFrozen) {
          columnPinning.left?.push?.(columnId);
        }
        if (column.rightFrozen) {
          columnPinning.right?.push?.(columnId);
        }
      }
    }

    if (grouping.length > 0) {
      columnPinning.left?.unshift?.(...grouping);
    }

    return {
      columnPinning,
      grouping,
    };
  });

  return { columnsDef, initialState };
}
