import type { ColumnDef, TableMeta } from "@tanstack/vue-table";
import {
  type GroupingState,
  type TableState as TableOptionsState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { type ComputedRef, type ModelRef, computed, watchEffect } from "vue";
import { ExpanderRenderer } from "../../components";
import type {
  CellClassInterface,
  CellRenderComponent,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnsVisibleState,
  DefaultGanttData,
  DefaultRow,
  ExpandedState,
  FilterFn,
  FilterRenderComponent,
  HeaderClassInterface,
  HeaderRenderComponent,
  PaginationState,
  RowSelectionState,
  SortFn,
  SortRenderComponent,
  SortingState,
  TableProps,
  TableRenderers,
} from "../../types";

type ExtraProps<Row extends DefaultRow> = {
  columnsDef: ComputedRef<ColumnDef<Row>[]>;
  initialState: ComputedRef<InitialState>;
};

type InitialState = {
  columnPinning: ColumnPinningState;
  grouping: GroupingState;
};

type TableState = {
  sorting: ModelRef<SortingState | undefined>;
  columnFilters: ModelRef<ColumnFiltersState | undefined>;
  columnOrder: ModelRef<ColumnOrderState | undefined>;
  columnPinning: ModelRef<ColumnPinningState | undefined>;
  columnSizing: ModelRef<ColumnSizingState | undefined>;
  columnVisibility: ModelRef<ColumnsVisibleState | undefined>;
  expanded: ModelRef<ExpandedState | undefined>;
  grouping: ModelRef<GroupingState | undefined>;
  pagination: ModelRef<PaginationState | undefined>;
  rowSelection: ModelRef<RowSelectionState | undefined>;
};

const RENDERERS: Required<TableRenderers<DefaultRow>> = {
  expander: ExpanderRenderer,
};

export function useTableOptions<
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
  extra: ExtraProps<RowData>,
  state: TableState,
) {
  const tableState: Partial<TableOptionsState> = {};

  /** STATE GETTERS */
  // eslint-disable-next-line no-lone-blocks
  {
    if (state.columnPinning.value != undefined) {
      Object.defineProperty(tableState, "columnPinning", {
        get() {
          return state.columnPinning.value;
        },
        enumerable: true,
      });
    } else {
      Object.defineProperty(tableState, "columnPinning", {
        get() {
          return extra.initialState.value.columnPinning;
        },
        enumerable: true,
      });
    }
    if (state.grouping.value != undefined) {
      Object.defineProperty(tableState, "grouping", {
        get() {
          return state.grouping.value;
        },
        enumerable: true,
      });
    } else {
      Object.defineProperty(tableState, "grouping", {
        get() {
          return extra.initialState.value.grouping;
        },
        enumerable: true,
      });
    }
    if (state.sorting.value != undefined) {
      Object.defineProperty(tableState, "sorting", {
        get() {
          return state.sorting.value;
        },
        enumerable: true,
      });
    }
    if (state.columnFilters.value != undefined) {
      Object.defineProperty(tableState, "columnFilters", {
        get() {
          return state.columnFilters.value;
        },
        enumerable: true,
      });
    }
    if (state.columnOrder.value != undefined) {
      Object.defineProperty(tableState, "columnOrder", {
        get() {
          return state.columnOrder.value;
        },
        enumerable: true,
      });
    }
    if (state.columnSizing.value != undefined) {
      Object.defineProperty(tableState, "columnSizing", {
        get() {
          return state.columnSizing.value;
        },
        enumerable: true,
      });
    }
    if (state.columnVisibility.value != undefined) {
      Object.defineProperty(tableState, "columnVisibility", {
        get() {
          return state.columnVisibility.value;
        },
        enumerable: true,
      });
    }
    if (state.expanded.value != undefined) {
      Object.defineProperty(tableState, "expanded", {
        get() {
          return state.expanded.value;
        },
        enumerable: true,
      });
    }
    if (state.pagination.value != undefined) {
      Object.defineProperty(tableState, "pagination", {
        get() {
          return state.pagination.value;
        },
        enumerable: true,
      });
    }
    if (state.rowSelection.value != undefined) {
      Object.defineProperty(tableState, "rowSelection", {
        get() {
          return state.rowSelection.value;
        },
        enumerable: true,
      });
    }
  }

  const tableInitialState: Partial<TableOptionsState> = {};

  /** STATE INITIAL GETTERS */
  // eslint-disable-next-line no-lone-blocks
  {
    if (props.initialColumnPinning != undefined) {
      Object.defineProperty(tableInitialState, "columnPinning", {
        get() {
          return props.initialColumnPinning;
        },
        enumerable: true,
      });
    }
    if (props.initialGrouping != undefined) {
      Object.defineProperty(tableInitialState, "grouping", {
        get() {
          return props.initialGrouping;
        },
        enumerable: true,
      });
    }
    if (props.initialSorting != undefined) {
      Object.defineProperty(tableInitialState, "sorting", {
        get() {
          return props.initialSorting;
        },
        enumerable: true,
      });
    }
    if (props.initialColumnFilters != undefined) {
      Object.defineProperty(tableInitialState, "columnFilters", {
        get() {
          return props.initialColumnFilters;
        },
        enumerable: true,
      });
    }
    if (props.initialColumnOrder != undefined) {
      Object.defineProperty(tableInitialState, "columnOrder", {
        get() {
          return props.initialColumnOrder;
        },
        enumerable: true,
      });
    }
    if (props.initialColumnSizing != undefined) {
      Object.defineProperty(tableInitialState, "columnSizing", {
        get() {
          return props.initialColumnSizing;
        },
        enumerable: true,
      });
    }
    if (props.initialColumnVisibility != undefined) {
      Object.defineProperty(tableInitialState, "columnVisibility", {
        get() {
          return props.initialColumnVisibility;
        },
        enumerable: true,
      });
    }
    if (props.initialExpanded != undefined) {
      Object.defineProperty(tableInitialState, "expanded", {
        get() {
          return props.initialExpanded;
        },
        enumerable: true,
      });
    }
    if (props.initialPagination != undefined) {
      Object.defineProperty(tableInitialState, "pagination", {
        get() {
          return props.initialPagination;
        },
        enumerable: true,
      });
    }
    if (props.initialRowSelection != undefined) {
      Object.defineProperty(tableInitialState, "rowSelection", {
        get() {
          return props.initialRowSelection;
        },
        enumerable: true,
      });
    }
  }

  const meta = computed<TableMeta<RowData>>(() => ({
    renderers: { ...(RENDERERS as TableRenderers<RowData>), ...props.renderers },
    pageSizes: props.pageSizes,
    totalRows: props.totalRows,
  }));

  const table = useVueTable({
    get data() {
      return props.rows;
    },
    get columns() {
      return extra.columnsDef.value;
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: props.getExpandedRowModel?.() ?? getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: tableState,
    initialState: tableInitialState,
    onGroupingChange:
      state.grouping.value != undefined
        ? (updater) => {
            state.grouping.value =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              updater instanceof Function ? updater(state.grouping.value!) : updater;
          }
        : undefined,
    onColumnOrderChange:
      state.columnOrder.value != undefined
        ? (updater) => {
            state.columnOrder.value =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              updater instanceof Function ? updater(state.columnOrder.value!) : updater;
          }
        : undefined,
    onColumnPinningChange:
      state.columnPinning.value != undefined
        ? (updater) => {
            state.columnPinning.value =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              updater instanceof Function ? updater(state.columnPinning.value!) : updater;
          }
        : undefined,
    onColumnSizingChange:
      state.columnSizing.value != undefined
        ? (updater) => {
            state.columnSizing.value =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              updater instanceof Function ? updater(state.columnSizing.value!) : updater;
          }
        : undefined,
    onColumnVisibilityChange:
      state.columnVisibility.value != undefined
        ? (updater) => {
            state.columnVisibility.value =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              updater instanceof Function ? updater(state.columnVisibility.value!) : updater;
          }
        : undefined,
    onExpandedChange:
      state.expanded.value != undefined
        ? (updater) => {
            state.expanded.value =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              updater instanceof Function ? updater(state.expanded.value!) : updater;
          }
        : undefined,
    onRowSelectionChange:
      state.rowSelection.value != undefined
        ? (updater) => {
            state.rowSelection.value =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              updater instanceof Function ? updater(state.rowSelection.value!) : updater;
          }
        : undefined,
    onSortingChange:
      state.sorting.value != undefined
        ? (updater) => {
            state.sorting.value =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              updater instanceof Function ? updater(state.sorting.value!) : updater;
          }
        : undefined,
    onColumnFiltersChange:
      state.columnFilters.value != undefined
        ? (updater) => {
            state.columnFilters.value =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              updater instanceof Function ? updater(state.columnFilters.value!) : updater;
          }
        : undefined,
    onPaginationChange:
      state.pagination.value != undefined
        ? (updater) => {
            state.pagination.value =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              updater instanceof Function ? updater(state.pagination.value!) : updater;
          }
        : undefined,
  });

  watchEffect(() => {
    table.setOptions((prev) => ({
      ...prev,
      get data() {
        return props.rows;
      },
      get columns() {
        return extra.columnsDef.value;
      },
      get meta() {
        return meta.value;
      },
      getSubRows: props.getSubRows,
      getRowId: props.getRowId,
      columnResizeMode: props.columnResizeMode ?? "onChange",
      groupedColumnMode: "reorder" as const,
      manualExpanding: props.manualExpanding,
      manualFiltering: props.manualFiltering,
      manualGrouping: props.manualGrouping,
      manualPagination: props.manualPagination,
      manualSorting: props.manualSorting,
    }));
  });

  return table;
}
