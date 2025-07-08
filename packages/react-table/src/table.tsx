import { type FilterInputValueType } from "@krainovsd/react-ui";
import type { TableOptions, TableState } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import { Gantt } from "./gantt";
import { TableCommon, TableFilter, TableFooter, TableLoading } from "./module/table";
import { useColumns, useTableOptions, useVirtualizer } from "./module/table/hooks";
import styles from "./table.module.scss";
import type {
  DefaultGanttData,
  DefaultRow,
  DragRowHandler,
  GanttProps,
  HeaderInterface,
  RowInterface,
  RowModel,
  TableColumnsSettings,
  TableEmptyProps,
  TableFilterProps,
  TableInterface,
  TableLoaderProps,
  TablePaginationProps,
  TableRenderers,
} from "./types";

export type TableProps<
  RowData extends DefaultRow,
  GanttData extends DefaultGanttData,
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
> = TableColumnsSettings<
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
> &
  Pick<
    TableOptions<RowData>,
    | "getSubRows"
    | "onExpandedChange"
    | "columnResizeMode"
    | "onGroupingChange"
    | "onColumnOrderChange"
    | "manualFiltering"
    | "manualExpanding"
    | "manualGrouping"
    | "manualPagination"
    | "manualSorting"
    | "onColumnFiltersChange"
    | "onColumnPinningChange"
    | "onColumnSizingChange"
    | "onColumnSizingInfoChange"
    | "onColumnVisibilityChange"
    | "onPaginationChange"
    | "onSortingChange"
    | "onRowSelectionChange"
    | "getRowId"
  > &
  Pick<
    Partial<TableState>,
    | "sorting"
    | "columnFilters"
    | "columnOrder"
    | "columnPinning"
    | "columnSizing"
    | "columnVisibility"
    | "expanded"
    | "grouping"
    | "pagination"
    | "rowSelection"
  > & {
    rows: RowData[];
    frozenHeader?: boolean;
    showPerf?: boolean;
    className?: string;
    renderers?: TableRenderers<RowData>;
    withPagination?: boolean;
    withFilters?: boolean;
    withTotal?: boolean;
    totalRows?: number;
    initialPageSize?: number;
    pageSizes?: number[];
    fullSize?: boolean;
    virtualColumn?: boolean;
    rubberColumn?: boolean;
    virtualColumnOverScan?: number;
    virtualRows?: boolean;
    virtualRowSize?: number;
    virtualRowOverScan?: number;
    locale?: string;
    onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
    onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
    Filter?: React.FC<TableFilterProps<RowData>>;
    Pagination?: React.FC<TablePaginationProps<RowData>>;
    Empty?: React.FC<TableEmptyProps>;
    Loader?: React.FC<TableLoaderProps>;
    loading?: boolean;
    setTable?: (table: TableInterface<RowData>) => void;
    rootRef?: React.MutableRefObject<HTMLDivElement | null>;
    headerRowClassName?: ((header: HeaderInterface<RowData>) => string | undefined) | string;
    rowClassName?: ((row: RowInterface<RowData>) => string | undefined) | string;
    rowRender?: (row: RowInterface<RowData>) => React.JSX.Element | null | undefined;
    getExpandedRowModel?: () => (table: TableInterface<RowData>) => () => RowModel<RowData>;
    draggableRow?: boolean;
    onDraggableRow?: DragRowHandler;
  } & GanttProps<RowData, GanttData>;

export function Table<
  RowData extends DefaultRow,
  GanttData extends DefaultGanttData,
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
  props: TableProps<
    RowData,
    GanttData,
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
  >,
) {
  let startRender = 0;
  if (props.showPerf) {
    startRender = performance.now();
  }

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const { columns, grouping, columnPinning, filterOptions } = useColumns({
    columns: props.columns,
    cellRenders: props.cellRenders,
    headerRenders: props.headerRenders,
    filterRenders: props.filterRenders,
    sortRenders: props.sortRenders,
    cellClasses: props.cellClasses,
    headerClasses: props.headerClasses,
    defaultColumnOptions: props.defaultColumnOptions,
    filterTypes: props.filterTypes,
    sortTypes: props.sortTypes,
    withGantt: props.withGantt,
    withFilters: props.withFilters ?? false,
    rubberColumn: props.rubberColumn ?? false,
  });

  const table = useTableOptions({
    ...props,
    initialState: { columnPinning, columns, grouping },
  });
  const tableState = table.getState();

  const filters = React.useMemo(() => {
    return Object.fromEntries(
      tableState.columnFilters.map((filter) => [filter.id, filter.value]),
    ) as Record<string, FilterInputValueType>;
  }, [tableState.columnFilters]);

  const {
    columnsVirtual,
    rowVirtual,
    rows,
    columnVirtualEnabled,
    rowVirtualizer,
    rowVirtualEnabled,
  } = useVirtualizer({
    initialColumns: props.columns,
    rows: props.rows,
    table,
    tableContainerRef,
    virtualColumn: props.virtualColumn,
    virtualRows: props.virtualRows,
    virtualRowSize: props.virtualRowSize,
    gantt: props.withGantt,
    ganttMini: props.ganttRowMini,
    virtualColumnOverScan: props.virtualColumnOverScan,
    virtualRowOverScan: props.virtualRowOverScan,
  });

  React.useEffect(() => {
    props.setTable?.(table);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, props.setTable]);

  try {
    return (
      <div
        className={clsx(styles.base, props.className)}
        style={{ height: props.fullSize ? "100%" : "fit-content" }}
        ref={props.rootRef}
      >
        {!props.Loader && props.loading && <TableLoading />}
        {props.Loader && props.loading && <props.Loader />}
        <TableFilter
          filterOptions={filterOptions}
          filters={filters}
          table={table}
          withFilters={props.withFilters ?? false}
          Filter={props.Filter}
        />
        {!props.withGantt && (
          <div
            ref={tableContainerRef}
            className={clsx(styles.container, props.fullSize && styles.container_full)}
            data-id={"container"}
          >
            <TableCommon
              columnVirtualEnabled={columnVirtualEnabled}
              rowVirtualEnabled={rowVirtualEnabled}
              columnsVirtual={columnsVirtual}
              rowsVirtual={rowVirtual}
              frozenHeader={props.frozenHeader ?? true}
              rubberColumn={props.rubberColumn ?? false}
              rowVirtualizer={rowVirtualizer}
              rows={rows}
              table={table}
              onClickRow={props.onClickRow}
              onDoubleClickRow={props.onDoubleClickRow}
              rowClassName={props.rowClassName}
              headerRowClassName={props.headerRowClassName}
              Empty={props.Empty}
              rowRender={props.rowRender}
              draggableRow={props.draggableRow ?? false}
              onDraggableRow={props.onDraggableRow}
            />
          </div>
        )}
        {props.withGantt && (
          <Gantt
            columnVirtualEnabled={columnVirtualEnabled}
            columnsVirtual={columnsVirtual}
            frozenHeader={props.frozenHeader ?? true}
            fullSize={props.fullSize}
            ganttRowMini={props.ganttRowMini}
            instantGanttSplitter={props.instantGanttSplitter}
            rowVirtualEnabled={rowVirtualEnabled}
            rowVirtualizer={rowVirtualizer}
            rows={rows}
            rowsVirtual={rowVirtual}
            table={table}
            withGantt={props.withGantt}
            GanttTooltip={props.GanttTooltip}
            firstGanttDate={props.firstGanttDate}
            ganttGrid={props.ganttGrid}
            ganttInfoGetter={props.ganttInfoGetter}
            ganttView={props.ganttView ?? "months"}
            lastGanttDate={props.lastGanttDate}
            locale={props.locale}
            onClickRow={props.onClickRow}
            onDoubleClickRow={props.onDoubleClickRow}
            tableContainerRef={tableContainerRef}
            GanttTask={props.GanttTask}
            rowClassName={props.rowClassName}
            headerRowClassName={props.headerRowClassName}
          />
        )}

        <TableFooter
          Pagination={props.Pagination}
          table={table}
          withPagination={props.withPagination && !props.withGantt}
          withTotal={props.withTotal && !props.withGantt}
          pageIndex={tableState.pagination.pageIndex}
          pageSize={tableState.pagination.pageSize}
          pageSizes={props.pageSizes}
          totalRows={props.totalRows ?? table.getFilteredRowModel().rows.length}
        />
      </div>
    );
  } catch (error) {
    console.error(error);

    return null;
  } finally {
    if (props.showPerf && startRender != undefined) {
      const endRender = performance.now();
      // eslint-disable-next-line no-console
      console.log(endRender - startRender);
    }
  }
}
