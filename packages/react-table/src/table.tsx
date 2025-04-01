import { type FilterInputValueType, FiltersBlock, Pagination } from "@krainovsd/react-ui";
import type {
  Cell,
  Header,
  TableOptions,
  Row as TableRow,
  TableState,
} from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import { useColumns, useTableOptions, useVirtualizer } from "./hooks";
import { getPrevFrozenWidthCell, getPrevFrozenWidthHeader } from "./lib";
import styles from "./table.module.scss";
import type { TableColumnsSettings, TableRenderers } from "./types";

export type TableProps<
  Row extends Record<string, unknown>,
  CellRender = undefined,
  HeaderRender = undefined,
  FilterRender = undefined,
  SortRender = undefined,
  CellClass = undefined,
  HeaderClass = undefined,
  FilterType = undefined,
  SortType = undefined,
> = TableColumnsSettings<
  Row,
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
    TableOptions<Row>,
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
    rows: Row[];
    frozenHeader?: boolean;
    showPerf?: boolean;
    className?: string;
    renderers?: TableRenderers<Row>;
    withPagination?: boolean;
    withFilters?: boolean;
    initialPageSize?: number;
    pageSizes?: number[];
    virtualColumn?: boolean;
    virtualRows?: boolean;
    virtualRowSize?: number;
    onClickRow?: (row: TableRow<Row>, event: React.MouseEvent<HTMLTableRowElement>) => void;
    onDoubleClickRow?: (row: TableRow<Row>, event: React.MouseEvent<HTMLTableRowElement>) => void;
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
  });

  const getHeader = React.useCallback(
    (header: Header<Row, unknown>, index: number, headers: Header<Row, unknown>[]) => {
      const headerContext = header.getContext();
      const headerClass = header.column.columnDef.headerClass;
      const headerClasses = headerClass.map((style) =>
        typeof style === "function" ? style(headerContext) : style,
      );
      const frozenPosition = header.column.getIsPinned();
      const prevFrozen = getPrevFrozenWidthHeader({ frozenPosition, headers, index });
      const canSort = header.column.getCanSort();
      const HeaderRender = header.column.columnDef.headerRender;
      const SortRender = header.column.columnDef.sortRender;

      return (
        <th
          key={header.id}
          colSpan={header.colSpan}
          className={clsx(
            styles.headerCell,
            frozenPosition === "left" && styles.headerCell__frozen_left,
            frozenPosition === "right" && styles.headerCell__frozen_right,
            frozenPosition === "left" &&
              header.column.getIsLastColumn("left") &&
              styles.headerCell__frozen_left_last,
            frozenPosition === "right" &&
              header.column.getIsFirstColumn("right") &&
              styles.headerCell__frozen_right_first,
            headerClasses,
          )}
          style={{
            width: header.getSize(),
            maxWidth: header.getSize(),
            minWidth: header.getSize(),
            left: frozenPosition === "left" ? prevFrozen : 0,
            right: frozenPosition === "right" ? prevFrozen : 0,
          }}
        >
          <HeaderRender context={headerContext} />
          {canSort && <SortRender context={headerContext} />}
          {header.column.getCanResize() && (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              onMouseDown={header.getResizeHandler()}
              onTouchStart={header.getResizeHandler()}
              className={styles.headerResize}
            />
          )}
        </th>
      );
    },
    [],
  );

  const getCell = React.useCallback(
    (cell: Cell<Row, unknown>, index: number, cells: Cell<Row, unknown>[]) => {
      const cellContext = cell.getContext();
      const cellClass = cell.column.columnDef.cellClass;
      const cellClasses = cellClass.map((style) =>
        typeof style === "function" ? style(cellContext) : style,
      );
      const isGroupCell = cell.row.getIsGrouped() && cell.row.groupingColumnId === cell.column.id;
      const frozenPosition = cell.column.getIsPinned();
      const prevFrozen = getPrevFrozenWidthCell({ frozenPosition, cells, index });
      const renderers = cellContext.table.options.meta?.renderers;
      const CellRender = cell.column.columnDef.cellRender;
      const Expander = renderers?.expander;

      return (
        <td
          key={cell.id}
          className={clsx(
            styles.cell,
            frozenPosition === "left" && styles.cell__frozen_left,
            frozenPosition === "right" && styles.cell__frozen_right,
            frozenPosition === "left" &&
              cell.column.getIsLastColumn("left") &&
              styles.cell__frozen_left_last,
            frozenPosition === "right" &&
              cell.column.getIsFirstColumn("right") &&
              styles.cell__frozen_right_first,
            cellClasses,
          )}
          style={{
            width: cell.column.getSize(),
            maxWidth: cell.column.getSize(),
            left: frozenPosition === "left" ? prevFrozen : 0,
            right: frozenPosition === "right" ? prevFrozen : 0,
          }}
        >
          {isGroupCell && Expander && <Expander context={cellContext} />}
          <CellRender context={cellContext} />
        </td>
      );
    },
    [],
  );

  try {
    return (
      <div className={clsx(styles.base, props.className)}>
        {props.withFilters && filterOptions.length > 0 && (
          <div className={styles.filterContainer}>
            <FiltersBlock
              filter={filters}
              filterLabel="Фильтр"
              fields={filterOptions}
              onValuesChange={(_, field, value) => {
                table.getColumn(field.toString())?.setFilterValue?.(value);
              }}
            />
          </div>
        )}
        <div ref={tableContainerRef} className={styles.container}>
          <table
            className={styles.table}
            style={{
              width: table.getTotalSize(),
            }}
          >
            <thead
              className={clsx(
                styles.header,
                (props.frozenHeader || props.frozenHeader == undefined) && styles.header__frozen,
              )}
            >
              {table.getHeaderGroups().map((headerGroup) => {
                /** ROW HEADER */
                return (
                  <tr key={headerGroup.id} className={styles.headerRow}>
                    {columnVirtualEnabled && (
                      <>
                        {virtualPaddingLeft ? (
                          <th style={{ display: "flex", width: virtualPaddingLeft }} />
                        ) : null}
                        {columnsVirtual.map((virtualColumn) => {
                          /** CELL HEADER  */
                          const header = headerGroup.headers[virtualColumn.index];

                          return getHeader(header, virtualColumn.index, headerGroup.headers);
                        })}
                        {virtualPaddingRight ? (
                          <th style={{ display: "flex", width: virtualPaddingRight }} />
                        ) : null}
                      </>
                    )}
                    {!columnVirtualEnabled && headerGroup.headers.map(getHeader)}
                  </tr>
                );
              })}
            </thead>
            <tbody
              className={styles.body}
              style={{
                height: rowVirtualEnabled ? `${rowVirtualizer.getTotalSize()}px` : undefined,
              }}
            >
              {rowVirtualEnabled &&
                rowVirtual.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  const visibleCells = row.getVisibleCells();

                  /** ROW */
                  return (
                    <tr
                      key={row.id}
                      className={clsx(styles.row, styles.row__virtual)}
                      data-index={virtualRow.index}
                      ref={(node) => rowVirtualizer.measureElement(node)}
                      style={{
                        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scrolls
                      }}
                      onClick={(event) => {
                        props.onClickRow?.(row, event);
                      }}
                      onDoubleClick={(event) => {
                        props.onDoubleClickRow?.(row, event);
                      }}
                    >
                      {columnVirtualEnabled && (
                        <>
                          {virtualPaddingLeft ? (
                            <td style={{ display: "flex", width: virtualPaddingLeft }} />
                          ) : null}
                          {columnsVirtual.map((virtualColumn) => {
                            /** CELL */
                            const cell = visibleCells[virtualColumn.index];

                            return getCell(cell, virtualColumn.index, visibleCells);
                          })}
                          {virtualPaddingRight ? (
                            <th style={{ display: "flex", width: virtualPaddingRight }} />
                          ) : null}
                        </>
                      )}
                      {!columnVirtualEnabled &&
                        visibleCells.map((cell, index, cells) => {
                          /** CELL */

                          return getCell(cell, index, cells);
                        })}
                    </tr>
                  );
                })}
              {!rowVirtualEnabled &&
                rows.map((row) => {
                  const visibleCells = row.getVisibleCells();

                  /** ROW */
                  return (
                    <tr
                      key={row.id}
                      className={styles.row}
                      data-index={row.index}
                      ref={(node) => rowVirtualizer.measureElement(node)}
                      onClick={(event) => {
                        props.onClickRow?.(row, event);
                      }}
                      onDoubleClick={(event) => {
                        props.onDoubleClickRow?.(row, event);
                      }}
                    >
                      {columnVirtualEnabled && (
                        <>
                          {virtualPaddingLeft ? (
                            <td style={{ display: "flex", width: virtualPaddingLeft }} />
                          ) : null}
                          {columnsVirtual.map((virtualColumn) => {
                            /** CELL */
                            const cell = visibleCells[virtualColumn.index];

                            return getCell(cell, virtualColumn.index, visibleCells);
                          })}
                          {virtualPaddingRight ? (
                            <th style={{ display: "flex", width: virtualPaddingRight }} />
                          ) : null}
                        </>
                      )}
                      {!columnVirtualEnabled &&
                        visibleCells.map((cell, index, cells) => {
                          /** CELL */

                          return getCell(cell, index, cells);
                        })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {props.withPagination && (
          <div className={styles.paginationContainer}>
            <div className={styles.paginationTotal}>{`Всего: ${filteredRowsCount}`}</div>
            <Pagination
              className={styles.pagination}
              defaultCurrent={tableState.pagination.pageIndex + 1}
              total={filteredRowsCount}
              pageSize={tableState.pagination.pageSize}
              onChange={(page, pageSize) => {
                table.setPageIndex(page - 1);
                table.setPageSize(pageSize);
              }}
              defaultPageSize={tableState.pagination.pageSize}
              pageSizeOptions={props.pageSizes ?? [10, 25, 50, 100, 150, 200]}
            />
          </div>
        )}

        {/* {props.withPagination && (
          <div className={styles.paginationContainer}>
            <span>
              Найдено: <span>{filteredRowsCount}</span>
            </span>
            <Pagination
              defaultCurrent={tableState.pagination.pageIndex + 1}
              total={filteredRowsCount}
              pageSize={tableState.pagination.pageSize}
              showSizeChanger={false}
              onChange={(page) => {
                table.setPageIndex(page - 1);
              }}
              showLessItems
            />
            <Select
              className={styles.pageSelect}
              value={tableState.pagination.pageSize}
              options={(props.pageSizes ?? [10, 25, 50, 100, 150, 200]).map((page) => ({
                value: page,
                label: page,
              }))}
              onChange={(value) => {
                table.setPageSize(value);
              }}
            />
          </div>
        )} */}
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
