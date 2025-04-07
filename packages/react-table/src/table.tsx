import { type FilterFieldType, type FilterInputValueType } from "@krainovsd/react-ui";
import type { TableOptions, TableState } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import { useColumns, useTableOptions, useVirtualizer } from "./hooks";
import { useSplitter } from "./hooks/use-splitter";
import { TableContainer } from "./table-container";
import { TableFilter } from "./table-filter";
import { TableFooter } from "./table-footer";
import { TableGantt } from "./table-gantt";
import styles from "./table.module.scss";
import type {
  GanttInfo,
  RowInterface,
  TableColumnsSettings,
  TableInterface,
  TableRenderers,
} from "./types";

export type TableProps<
  RowData extends Record<string, unknown>,
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
    withGantt?: boolean;
    firstGanttDate?: string;
    lastGanttDate?: string;
    ganttInfoGetter?: (row: RowInterface<RowData>) => GanttInfo;
    instantGanttSplitter?: boolean;
    initialPageSize?: number;
    pageSizes?: number[];
    fullSize?: boolean;
    virtualColumn?: boolean;
    virtualRows?: boolean;
    virtualRowSize?: number;
    onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLTableRowElement>) => void;
    onDoubleClickRow?: (
      row: RowInterface<RowData>,
      event: React.MouseEvent<HTMLTableRowElement>,
    ) => void;
    Filter?: React.FC<{
      table: TableInterface<RowData>;
      filters: Record<string, FilterInputValueType>;
      filterOptions: FilterFieldType[];
    }>;
    Pagination?: React.FC<{ table: TableInterface<RowData> }>;
  };

export function Table<
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
  props: TableProps<
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
  });

  const { sizes, startDrag, splitterRef, isDragging, splitterGhostRef, splitterOverflowRef } =
    useSplitter(props.instantGanttSplitter);

  try {
    return (
      <div className={clsx(styles.base, props.className)}>
        <TableFilter
          filterOptions={filterOptions}
          filters={filters}
          table={table}
          withFilters={props.withFilters ?? false}
          Filter={props.Filter}
        />

        <div
          ref={tableContainerRef}
          className={clsx(
            styles.container,
            props.withGantt && styles.container__gantt,
            props.fullSize && styles.container_full,
          )}
          data-id={"container"}
        >
          {!props.withGantt && (
            <TableContainer
              gantt={props.withGantt}
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
            />
          )}
          {props.withGantt && (
            <>
              <div className={styles.ganttContainer}>
                <TableContainer
                  gantt={props.withGantt}
                  width={sizes[0]}
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
                />
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div className={clsx(styles.splitter)} ref={splitterRef} onMouseDown={startDrag}>
                  <div className={styles.splitter__trigger}></div>
                  <div ref={splitterGhostRef} className={styles.splitter__ghost}></div>
                </div>
                {!props.instantGanttSplitter && (
                  <div
                    className={clsx(
                      styles.splitter__overflowContainer,
                      isDragging && styles.splitter__overflowContainer_active,
                    )}
                  >
                    <div className={styles.splitter__overflow} ref={splitterOverflowRef}></div>
                  </div>
                )}
                <TableGantt
                  width={sizes[1]}
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
                  firstGanttDate={props.firstGanttDate}
                  lastGanttDate={props.lastGanttDate}
                  ganttInfoGetter={props.ganttInfoGetter}
                />
              </div>
            </>
          )}
        </div>
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
