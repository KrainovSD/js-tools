import type { Cell, Header } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import { getPrevFrozenWidthCell, getPrevFrozenWidthHeader } from "./lib";
import styles from "./table-gantt.module.scss";
import type { RowInterface, TableInterface } from "./types";

type TableContainerProps<RowData extends Record<string, unknown>> = {
  columnVirtualEnabled: boolean;
  rowVirtualEnabled: boolean;
  table: TableInterface<RowData>;
  frozenHeader: boolean;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  columnsVirtual: VirtualItem[];
  rowsVirtual: VirtualItem[];
  rows: RowInterface<RowData>[];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLTableRowElement>) => void;
  onDoubleClickRow?: (
    row: RowInterface<RowData>,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => void;
};

export function TableGantt<RowData extends Record<string, unknown>>(
  props: TableContainerProps<RowData>,
) {
  const getHeader = React.useCallback(
    (header: Header<RowData, unknown>, index: number, headers: Header<RowData, unknown>[]) => {
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
    (cell: Cell<RowData, unknown>, index: number, cells: Cell<RowData, unknown>[]) => {
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

  return (
    <table
      className={styles.table}
      style={{
        width: props.columnVirtualEnabled ? props.table.getTotalSize() : "100%",
      }}
    >
      <thead
        className={clsx(
          styles.header,
          (props.frozenHeader || props.frozenHeader == undefined) && styles.header__frozen,
        )}
      >
        {props.table.getHeaderGroups().map((headerGroup) => {
          /** ROW HEADER */
          return (
            <tr key={headerGroup.id} className={styles.headerRow}>
              {props.columnVirtualEnabled && (
                <>
                  {props.virtualPaddingLeft ? (
                    <th style={{ display: "flex", width: props.virtualPaddingLeft }} />
                  ) : null}
                  {props.columnsVirtual.map((virtualColumn) => {
                    /** CELL HEADER  */
                    const header = headerGroup.headers[virtualColumn.index];

                    return getHeader(header, virtualColumn.index, headerGroup.headers);
                  })}
                  {props.virtualPaddingRight ? (
                    <th style={{ display: "flex", width: props.virtualPaddingRight }} />
                  ) : null}
                </>
              )}
              {!props.columnVirtualEnabled && headerGroup.headers.map(getHeader)}
            </tr>
          );
        })}
      </thead>
      <tbody
        className={styles.body}
        style={{
          height: props.rowVirtualEnabled ? `${props.rowVirtualizer.getTotalSize()}px` : undefined,
        }}
      >
        {props.rowVirtualEnabled &&
          props.rowsVirtual.map((virtualRow) => {
            const row = props.rows[virtualRow.index];
            const visibleCells = row.getVisibleCells();

            /** ROW */
            return (
              <tr
                key={row.id}
                className={clsx(styles.row, styles.row__virtual)}
                data-index={virtualRow.index}
                ref={(node) => props.rowVirtualizer.measureElement(node)}
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
                {props.columnVirtualEnabled && (
                  <>
                    {props.virtualPaddingLeft ? (
                      <td style={{ display: "flex", width: props.virtualPaddingLeft }} />
                    ) : null}
                    {props.columnsVirtual.map((virtualColumn) => {
                      /** CELL */
                      const cell = visibleCells[virtualColumn.index];

                      return getCell(cell, virtualColumn.index, visibleCells);
                    })}
                    {props.virtualPaddingRight ? (
                      <th style={{ display: "flex", width: props.virtualPaddingRight }} />
                    ) : null}
                  </>
                )}
                {!props.columnVirtualEnabled &&
                  visibleCells.map((cell, index, cells) => {
                    /** CELL */

                    return getCell(cell, index, cells);
                  })}
              </tr>
            );
          })}
        {!props.rowVirtualEnabled &&
          props.rows.map((row) => {
            const visibleCells = row.getVisibleCells();

            /** ROW */
            return (
              <tr
                key={row.id}
                className={styles.row}
                data-index={row.index}
                ref={(node) => props.rowVirtualizer.measureElement(node)}
                onClick={(event) => {
                  props.onClickRow?.(row, event);
                }}
                onDoubleClick={(event) => {
                  props.onDoubleClickRow?.(row, event);
                }}
              >
                {props.columnVirtualEnabled && (
                  <>
                    {props.virtualPaddingLeft ? (
                      <td style={{ display: "flex", width: props.virtualPaddingLeft }} />
                    ) : null}
                    {props.columnsVirtual.map((virtualColumn) => {
                      /** CELL */
                      const cell = visibleCells[virtualColumn.index];

                      return getCell(cell, virtualColumn.index, visibleCells);
                    })}
                    {props.virtualPaddingRight ? (
                      <th style={{ display: "flex", width: props.virtualPaddingRight }} />
                    ) : null}
                  </>
                )}
                {!props.columnVirtualEnabled &&
                  visibleCells.map((cell, index, cells) => {
                    /** CELL */

                    return getCell(cell, index, cells);
                  })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
