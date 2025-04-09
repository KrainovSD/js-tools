import type { Cell, Header } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import { getPrevFrozenWidthCell, getPrevFrozenWidthHeader } from "../lib";
import styles from "./use-table-cell.module.scss";

export function useTableCell<RowData extends Record<string, unknown>>(table: boolean) {
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

      if (table) {
        return (
          <th
            data-id="header-cell"
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
      }

      return (
        <div
          data-id="header-cell"
          key={header.id}
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
            maxWidth: header.column.columnDef.maxSize,
            minWidth: header.column.columnDef.minSize,
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
        </div>
      );
    },
    [table],
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

      if (table) {
        return (
          <td
            data-id="cell"
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
              minWidth: cell.column.getSize(),
              left: frozenPosition === "left" ? prevFrozen : 0,
              right: frozenPosition === "right" ? prevFrozen : 0,
            }}
          >
            {isGroupCell && Expander && <Expander context={cellContext} />}
            <CellRender context={cellContext} />
          </td>
        );
      }

      return (
        <div
          data-id="cell"
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
            maxWidth: cell.column.columnDef.maxSize,
            minWidth: cell.column.columnDef.minSize,
            left: frozenPosition === "left" ? prevFrozen : 0,
            right: frozenPosition === "right" ? prevFrozen : 0,
          }}
        >
          {isGroupCell && Expander && <Expander context={cellContext} />}
          <CellRender context={cellContext} />
        </div>
      );
    },
    [table],
  );

  return { getHeader, getCell };
}
