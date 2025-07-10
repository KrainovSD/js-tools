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
  grouped: GroupingState;
  pinned: ColumnPinningState;
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
  > & { initialState: InitialState<RowData>; pageSizes?: number[]; totalRows?: number | undefined },
) {
  const options = computed<TableOptions<RowData>>(() => {
    const tableOptions: TableOptions<RowData> = {
      data: props.rows,
      columns: props.initialState.columns,
      state: {
        grouping: props.grouping,
      },
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
    };

    if (tableOptions.state) {
      /** grouping */
      if (props.grouping != undefined && props.onGroupingChange != undefined) {
        tableOptions.state.grouping = props.grouping;
        tableOptions.onGroupingChange = props.onGroupingChange;

        if (props.manualGrouping) {
          tableOptions.manualGrouping = true;
          tableOptions.getGroupedRowModel = undefined;
        } else {
          tableOptions.manualGrouping = false;
          tableOptions.getGroupedRowModel = getGroupedRowModel();
        }
      } else if (props.initialState.grouped.length > 0) {
        tableOptions.state.grouping = props.initialState.grouped;
        tableOptions.manualGrouping = false;
        tableOptions.getGroupedRowModel = getGroupedRowModel();
      }
      /** pinning */
      if (props.columnPinning != undefined && props.onColumnPinningChange != undefined) {
        tableOptions.state.columnPinning = props.columnPinning;
        tableOptions.onColumnPinningChange = props.onColumnPinningChange;
      } else {
        tableOptions.state.columnPinning = props.initialState.pinned;
      }
      /** visibility */
      if (props.columnVisibility != undefined && props.onColumnVisibilityChange != undefined) {
        tableOptions.state.columnVisibility = props.columnVisibility;
        tableOptions.onColumnVisibilityChange = props.onColumnVisibilityChange;
      }
      /** sizing */
      if (props.columnSizing != undefined && props.onColumnSizingChange != undefined) {
        tableOptions.state.columnSizing = props.columnSizing;
        tableOptions.onColumnSizingChange = props.onColumnSizingChange;
      }
      /** order */
      if (props.columnOrder != undefined && props.onColumnOrderChange != undefined) {
        tableOptions.state.columnOrder = props.columnOrder;
        tableOptions.onColumnOrderChange = props.onColumnOrderChange;
      }
      /** expanded */
      if (props.expanded != undefined && props.onExpandedChange != undefined) {
        tableOptions.state.expanded = props.expanded;
        tableOptions.onExpandedChange = props.onExpandedChange;
        if (props.manualExpanding) {
          tableOptions.manualExpanding = true;
          tableOptions.getExpandedRowModel = undefined;
        } else {
          tableOptions.manualExpanding = false;
          tableOptions.getExpandedRowModel = props.getExpandedRowModel?.() ?? getExpandedRowModel();
        }
      } else {
        tableOptions.manualExpanding = false;
        tableOptions.getExpandedRowModel = props.getExpandedRowModel?.() ?? getExpandedRowModel();
      }
      /** selecting */
      if (props.rowSelection != undefined && props.onRowSelectionChange != undefined) {
        tableOptions.state.rowSelection = props.rowSelection;
        tableOptions.onRowSelectionChange = props.onRowSelectionChange;
      }
      /** sorting */
      if (props.sorting != undefined && props.onSortingChange != undefined) {
        tableOptions.state.sorting = props.sorting;
        tableOptions.onSortingChange = props.onSortingChange;

        if (props.manualSorting) {
          tableOptions.manualSorting = true;
          tableOptions.getSortedRowModel = undefined;
        } else {
          tableOptions.manualSorting = false;
          tableOptions.getSortedRowModel = getSortedRowModel();
        }
      } else {
        tableOptions.manualSorting = false;
        tableOptions.getSortedRowModel = getSortedRowModel();
      }
      /** filter */
      if (props.columnFilters != undefined && props.onColumnFiltersChange != undefined) {
        tableOptions.state.columnFilters = props.columnFilters;
        tableOptions.onColumnFiltersChange = props.onColumnFiltersChange;

        if (props.manualFiltering) {
          tableOptions.manualFiltering = true;
          tableOptions.getFilteredRowModel = undefined;
        } else {
          tableOptions.manualFiltering = false;
          tableOptions.getFilteredRowModel = getFilteredRowModel();
        }
      } else {
        tableOptions.manualFiltering = false;
        tableOptions.getFilteredRowModel = getFilteredRowModel();
      }

      if (props.withPagination && !props.withGantt) {
        /** paginating */
        if (props.pagination != undefined && props.onPaginationChange != undefined) {
          tableOptions.state.pagination = props.pagination;
          tableOptions.onPaginationChange = props.onPaginationChange;

          if (props.manualPagination) {
            tableOptions.manualPagination = true;
            tableOptions.getPaginationRowModel = undefined;
          } else {
            tableOptions.manualPagination = false;
            tableOptions.getPaginationRowModel = getPaginationRowModel();
          }
        } else if (tableOptions.initialState) {
          tableOptions.manualPagination = false;
          tableOptions.getPaginationRowModel = getPaginationRowModel();
          tableOptions.initialState.pagination = {
            pageIndex: 0,
            pageSize: props.initialPageSize ?? props.pageSizes?.[0] ?? 50,
          };
        }
      }
    }

    return tableOptions;
  });

  const table = useVueTable(options.value);

  return table;
}
