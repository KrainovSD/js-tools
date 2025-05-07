import type { Cell, ColumnOrderState, Header, Updater } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import { getPrevFrozenWidthCell, getPrevFrozenWidthHeader } from "../lib";
import styles from "./use-table-cell.module.scss";

const RESIZE_HANDLE_WIDTH = 10;
const THRESHOLD = 2;

function handleDragStart(event: React.DragEvent<HTMLElement>) {
  const { left, width } = event.currentTarget.getBoundingClientRect();
  const isOverResize = event.clientX >= left + width - RESIZE_HANDLE_WIDTH - THRESHOLD;

  if (isOverResize) {
    event.preventDefault();

    return;
  }

  if (event.dataTransfer) {
    const index = event.currentTarget.getAttribute("data-column-index");
    if (!index) return;

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text", index);
    event.currentTarget.style.opacity = "var(--table-header-drag-opacity)";
  }
}

function handleDragEnd(event: React.DragEvent<HTMLElement>) {
  event.preventDefault();
  event.currentTarget.style.opacity = "1";
}

function handleDragEnter(event: React.DragEvent<HTMLElement>) {
  event.currentTarget.style.background = "var(--table-header-drag-bg)";
}

function handleDragLeave(event: React.DragEvent<HTMLElement>) {
  if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node))
    event.currentTarget.style.background = "";
}

function handleDropGetter(
  columnOrderState: ColumnOrderState,
  setColumnOrderState: (updater: Updater<ColumnOrderState>) => void,
) {
  return function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.currentTarget.style.background = "";
    const draggableIndex = event.dataTransfer?.getData?.("text");
    const droppableIndex = event.currentTarget.getAttribute("data-column-index");

    if (
      draggableIndex == undefined ||
      droppableIndex == undefined ||
      draggableIndex === droppableIndex
    )
      return;

    const order = [...columnOrderState];
    [order[+draggableIndex], order[+droppableIndex]] = [
      order[+droppableIndex],
      order[+draggableIndex],
    ];
    setColumnOrderState(order);
  };
}

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
      const HeaderRender = header.column.columnDef.headerRender;
      const draggable = header.column.columnDef.enableDraggable;

      if (!HeaderRender) return null;

      if (table) {
        return (
          <th
            data-id="header-cell"
            data-column-index={index}
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
              cursor: draggable ? "move" : "inherit",
            }}
            draggable={draggable}
            onDragOver={draggable ? (event) => event.preventDefault() : undefined}
            onDragStart={draggable ? handleDragStart : undefined}
            onDragEnd={draggable ? handleDragEnd : undefined}
            onDragEnter={draggable ? handleDragEnter : undefined}
            onDragLeave={draggable ? handleDragLeave : undefined}
            onDrop={
              draggable
                ? handleDropGetter(
                    headerContext.table.getState().columnOrder,
                    headerContext.table.setColumnOrder,
                  )
                : undefined
            }
          >
            <HeaderRender context={headerContext} />

            {header.column.getCanResize() && (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <div
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                className={styles.headerResize}
                style={{
                  width: RESIZE_HANDLE_WIDTH,
                }}
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
            width: header.column.getSize(),
            maxWidth: header.column.getSize(),
            minWidth: header.column.getSize(),
            left: frozenPosition === "left" ? prevFrozen : 0,
            right: frozenPosition === "right" ? prevFrozen : 0,
          }}
        >
          <HeaderRender context={headerContext} />
          {header.column.getCanResize() && (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              onMouseDown={header.getResizeHandler()}
              onTouchStart={header.getResizeHandler()}
              className={styles.headerResize}
              style={{
                width: RESIZE_HANDLE_WIDTH,
              }}
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

      if (!CellRender) return null;

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
            maxWidth: cell.column.getSize(),
            minWidth: cell.column.getSize(),
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
