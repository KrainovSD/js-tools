import { type FilterFieldType, type FilterInputValueType } from "@krainovsd/react-ui";
import type { TableOptions, TableState } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import { Gantt } from "./gantt";
import { TableCommon, TableFilter, TableFooter } from "./module/table";
import { useColumns, useTableOptions, useVirtualizer } from "./module/table/hooks";
import styles from "./table.module.scss";
import type {
  GanttProps,
  RowInterface,
  TableColumnsSettings,
  TableInterface,
  TableRenderers,
} from "./types";

export type TableProps<
  RowData extends Record<string, unknown>,
  GanttData extends Record<string, unknown>,
  CellRender = undefined,
  HeaderRender = undefined,
  FilterRender = undefined,
  SortRender = undefined,
  CellClass = undefined,
  HeaderClass = undefined,
  FilterType = undefined,
  SortType = undefined,
> = TableColumnsSettings<
  RowData,
  CellRender,
  HeaderRender,
  FilterRender,
  SortRender,
  CellClass,
  HeaderClass,
  FilterType,
  SortType
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
    initialPageSize?: number;
    pageSizes?: number[];
    fullSize?: boolean;
    virtualColumn?: boolean;
    virtualRows?: boolean;
    virtualRowSize?: number;
    locale?: string;
    onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
    onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
    Filter?: React.FC<{
      table: TableInterface<RowData>;
      filters: Record<string, FilterInputValueType>;
      filterOptions: FilterFieldType[];
    }>;
    Pagination?: React.FC<{ table: TableInterface<RowData> }>;
    setTable?: (table: TableInterface<RowData>) => void;
    rootRef?: React.MutableRefObject<HTMLDivElement | null>;
    rowClassName?: ((row: RowInterface<RowData>) => string) | string;
  } & GanttProps<RowData, GanttData>;

export function Table<
  Row extends Record<string, unknown>,
  GanttData extends Record<string, unknown>,
  CellRender = undefined,
  HeaderRender = undefined,
  FilterRender = undefined,
  SortRender = undefined,
  CellClass = undefined,
  HeaderClass = undefined,
  FilterType = undefined,
  SortType = undefined,
>(
  props: TableProps<
    Row,
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
  });

  const table = useTableOptions({
    ...props,
    initialState: { columnPinning, columns, grouping },
  });
  const tableState = table.getState();
  const filteredRowsCount = table.getFilteredRowModel().rows.length;

  const filters = React.useMemo(() => {
    return Object.fromEntries(
      tableState.columnFilters.map((filter) => [filter.id, filter.value]),
    ) as Record<string, FilterInputValueType>;
  }, [tableState.columnFilters]);

  const {
    columnsVirtual,
    rowVirtual,
    rows,
    virtualPaddingLeft,
    virtualPaddingRight,
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
  });

  React.useEffect(() => {
    props.setTable?.(table);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, props.setTable]);

  try {
    return (
      <div className={clsx(styles.base, props.className)} ref={props.rootRef}>
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
              rowVirtualizer={rowVirtualizer}
              rows={rows}
              table={table}
              virtualPaddingLeft={virtualPaddingLeft}
              virtualPaddingRight={virtualPaddingRight}
              onClickRow={props.onClickRow}
              onDoubleClickRow={props.onDoubleClickRow}
              rowClassName={props.rowClassName}
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
            virtualPaddingLeft={virtualPaddingLeft}
            virtualPaddingRight={virtualPaddingRight}
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
          />
        )}

        <TableFooter
          filteredRowsCount={filteredRowsCount}
          pageSizes={props.pageSizes}
          Pagination={props.Pagination}
          table={table}
          withPagination={props.withPagination && !props.withGantt}
          withTotal={props.withTotal && !props.withGantt}
        />
      </div>
    );
  } catch (error) {
    console.error(error);

    return null;
  } finally {
    if (props.showPerf && startRender) {
      const endRender = performance.now();
      // eslint-disable-next-line no-console
      console.log(endRender - startRender);
    }
  }
}
