import type { ColumnDef, ColumnPinningState } from "@tanstack/vue-table";
import {
  type GroupingState,
  type TableOptions,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { computed } from "vue";
import { ExpanderRenderer } from "../../components";
import { DEFAULT_TABLE_COLUMN_SIZE } from "../../constants";
import type {
  CellClassInterface,
  CellRenderComponent,
  DefaultGanttData,
  DefaultRow,
  FilterFn,
  FilterRenderComponent,
  HeaderClassInterface,
  HeaderRenderComponent,
  SortFn,
  SortRenderComponent,
  TableProps,
  TableRenderers,
} from "../../types";

type InitialState<Row extends DefaultRow> = {
  initialGrouping: GroupingState;
  initialColumnPinning: ColumnPinningState;
  columns: ColumnDef<Row>[];
};

const RENDERERS: Required<TableRenderers<DefaultRow>> = {
  expander: ExpanderRenderer,
};

export function useTableOptions<
  RowData extends DefaultRow,
  GanttData extends DefaultGanttData,
  CellRender extends Record<string, CellRenderComponent<RowData>> = {},
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
  FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
  SortRender extends Record<string, SortRenderComponent<RowData>> = {},
  CellClass extends Record<string, CellClassInterface<RowData>> = {},
  HeaderClass extends Record<string, HeaderClassInterface<RowData>> = {},
  FilterType extends Record<string, FilterFn<RowData>> = {},
  SortType extends Record<string, SortFn<RowData>> = {},
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
  > &
    InitialState<RowData> & { pageSizes?: number[]; totalRows?: number | undefined },
) {
  const options = computed<TableOptions<RowData>>(() => {
    const tableOptions: TableOptions<RowData> = {
      data: props.rows,
      columns: props.columns,
      state: {},
      initialState: {},
      meta: {
        renderers: RENDERERS as TableRenderers<RowData>,
        pageSizes: props.pageSizes,
        totalRows: props.totalRows,
      },
      getSubRows: props.getSubRows,
      getRowId: props.getRowId,
      getCoreRowModel: getCoreRowModel(),
      columnResizeMode: props.columnResizeMode ?? "onChange",
      groupedColumnMode: "reorder",
      defaultColumn: {
        size: props.defaultColumnOptions?.width ?? DEFAULT_TABLE_COLUMN_SIZE,
        minSize: props.defaultColumnOptions?.minWidth,
        maxSize: props.defaultColumnOptions?.maxWidth,
      },
      /** grouped */
      onGroupingChange: props.onGroupingChange,
      manualGrouping: props.manualGrouping,
      getGroupedRowModel:
        (props.grouping != undefined ||
          (props.grouping == undefined && props.initialGrouping.length > 0)) &&
        !props.manualGrouping
          ? getGroupedRowModel()
          : undefined,
      onColumnPinningChange: props.onColumnPinningChange,
      onColumnVisibilityChange: props.onColumnVisibilityChange,
      onColumnSizingChange: props.onColumnSizingChange,
      onColumnOrderChange: props.onColumnOrderChange,
      /** expanded */
      onExpandedChange: props.onExpandedChange,
      manualExpanding: props.manualExpanding,
      getExpandedRowModel:
        props.getExpandedRowModel?.() ??
        (props.expanded != undefined && !props.manualExpanding ? getExpandedRowModel() : undefined),
      onRowSelectionChange: props.onRowSelectionChange,
      /** sorted */
      onSortingChange: props.onSortingChange,
      manualSorting: props.manualSorting,
      getSortedRowModel:
        props.sorting != undefined && !props.manualSorting ? getSortedRowModel() : undefined,
      /** filtered */
      onColumnFiltersChange: props.onColumnFiltersChange,
      manualFiltering: props.manualFiltering,
      getFilteredRowModel:
        props.columnFilters != undefined && !props.manualFiltering
          ? getFilteredRowModel()
          : undefined,
      /** pagination */
      onPaginationChange: props.onPaginationChange,
      manualPagination: props.manualPagination,
      getPaginationRowModel:
        !props.withGantt && props.withPagination && !props.manualPagination
          ? getPaginationRowModel()
          : undefined,
    };

    if (tableOptions.state && tableOptions.initialState) {
      /** grouping */
      if (props.grouping != undefined) {
        if (props.onGroupingChange != undefined) {
          tableOptions.state.grouping = props.grouping;
        } else {
          tableOptions.initialState.grouping = props.grouping;
        }
      } else {
        tableOptions.initialState.grouping = props.initialGrouping;
      }

      /** pining */
      if (props.columnPinning != undefined) {
        if (props.onColumnPinningChange != undefined) {
          tableOptions.state.columnPinning = props.columnPinning;
        } else {
          tableOptions.initialState.columnPinning = props.columnPinning;
        }
      } else {
        tableOptions.initialState.columnPinning = props.initialColumnPinning;
      }

      /** visibility */
      if (props.columnVisibility != undefined) {
        if (props.onColumnVisibilityChange != undefined) {
          tableOptions.state.columnVisibility = props.columnVisibility;
        } else {
          tableOptions.initialState.columnVisibility = props.columnVisibility;
        }
      }

      /** sizing */
      if (props.columnSizing != undefined) {
        if (props.onColumnSizingChange != undefined) {
          tableOptions.state.columnSizing = props.columnSizing;
        } else {
          tableOptions.initialState.columnSizing = props.columnSizing;
        }
      }

      /** order */
      if (props.columnOrder != undefined) {
        if (props.onColumnOrderChange != undefined) {
          tableOptions.state.columnOrder = props.columnOrder;
        } else {
          tableOptions.initialState.columnOrder = props.columnOrder;
        }
      }

      /** expanded */
      if (props.expanded != undefined) {
        if (props.onExpandedChange != undefined) {
          tableOptions.state.expanded = props.expanded;
        } else {
          tableOptions.initialState.expanded = props.expanded;
        }
      }

      /** selection */
      if (props.rowSelection != undefined) {
        if (props.onRowSelectionChange != undefined) {
          tableOptions.state.rowSelection = props.rowSelection;
        } else {
          tableOptions.initialState.rowSelection = props.rowSelection;
        }
      }

      /** sorting */
      if (props.sorting != undefined) {
        if (props.onSortingChange != undefined) {
          tableOptions.state.sorting = props.sorting;
        } else {
          tableOptions.initialState.sorting = props.sorting;
        }
      }

      /** filters */
      if (props.columnFilters != undefined) {
        if (props.onColumnFiltersChange != undefined) {
          tableOptions.state.columnFilters = props.columnFilters;
        } else {
          tableOptions.initialState.columnFilters = props.columnFilters;
        }
      }

      /** pagination */
      if (props.pagination != undefined) {
        if (props.onPaginationChange != undefined) {
          tableOptions.state.pagination = props.pagination;
        } else {
          tableOptions.initialState.pagination = props.pagination;
        }
      } else {
        tableOptions.initialState.pagination = {
          pageIndex: 0,
          pageSize: props.initialPageSize ?? props.pageSizes?.[0] ?? 50,
        };
      }
    }

    return tableOptions;
  });

  const table = useVueTable(options.value);

  return table;
}
