import type { Cell } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { DefaultRow, DragRowHandler, RowInterface } from "../../types";
import { TableCell } from "./table-cell";
import styles from "./table-row.module.scss";

type Props<RowData extends DefaultRow> = {
  rows: RowInterface<RowData>[];
  selected: boolean;
  row: RowInterface<RowData> | null;
  columnsVirtual: string[];
  virtualRow: VirtualItem | null;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
  onClickRow:
    | ((row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void)
    | undefined;
  onDoubleClickRow:
    | ((row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void)
    | undefined;
  columnVirtualEnabled: boolean;
  expanded: boolean;
  CustomRow: React.JSX.Element | undefined | null;
  visibleCells: Cell<RowData, unknown>[];
  height: number | undefined;
  draggableRow: boolean;
  onDraggableRow: DragRowHandler | undefined;
};

export const TableRow = React.memo(function TableRow<RowData extends DefaultRow>(
  props: Props<RowData>,
) {
  const row = props.virtualRow ? props.rows[props.virtualRow.index] : props.row;
  const draggable = Boolean(props.draggableRow && props.onDraggableRow);

  if (!row) return;
  const leftVisibleCells = row.getLeftVisibleCells();
  const centerVisibleCells = row.getCenterVisibleCells();
  const rightVisibleCells = row.getRightVisibleCells();

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if ((event.key === " " || event.key === "Enter") && event.target === event.currentTarget) {
      event.preventDefault();
      event.currentTarget.click();
    }
    if (
      event.key === "ArrowUp" &&
      event.currentTarget.previousElementSibling instanceof HTMLDivElement
    ) {
      event.currentTarget.previousElementSibling.focus();
      event.preventDefault();
    }
    if (
      event.key === "ArrowDown" &&
      event.currentTarget.nextElementSibling instanceof HTMLDivElement
    ) {
      event.currentTarget.nextElementSibling.focus();
      event.preventDefault();
    }
  }

  /** ROW */
  return (
    <div
      data-id="row"
      role="row"
      tabIndex={0}
      key={row.id}
      className={clsx(
        styles.row,
        props.selected && styles.row__selected,
        props.virtualRow && styles.row__virtual,
        typeof props.rowClassName === "function" ? props.rowClassName(row) : props.rowClassName,
        "ksd-table-row",
      )}
      data-index={props.virtualRow ? props.virtualRow.index : row.index}
      ref={props.virtualRow ? (node) => props.rowVirtualizer.measureElement(node) : undefined}
      style={{
        transform: props.virtualRow ? `translateY(${props.virtualRow.start}px)` : undefined,
        minHeight: props.height,
        maxHeight: props.height,
      }}
      onClick={(event) => {
        props.onClickRow?.(row, event);
      }}
      onDoubleClick={(event) => {
        props.onDoubleClickRow?.(row, event);
      }}
      onKeyDown={onKeyDown}
      draggable={draggable}
      onDragOver={draggable ? (event) => event.preventDefault() : undefined}
      onDragStart={draggable ? handleDragStart : undefined}
      onDragEnd={draggable ? handleDragEnd : undefined}
      onDragEnter={draggable ? handleDragEnter : undefined}
      onDragLeave={draggable ? handleDragLeave : undefined}
      onDrop={draggable ? handleDropGetter(props.rows, props.onDraggableRow) : undefined}
    >
      <>
        {props.columnVirtualEnabled && !props.CustomRow && (
          <>
            {leftVisibleCells.map((cell, index, cells) => {
              /** LEFT CELL */

              return (
                <TableCell
                  key={cell.column.columnDef.id}
                  cell={cell}
                  index={index}
                  cells={cells}
                  columnPosition={index + 1}
                  selected={props.selected}
                  expanded={props.expanded}
                />
              );
            })}
            {props.columnsVirtual.map((index) => {
              /** CENTER CELL */

              const cell = centerVisibleCells[+index];

              return (
                <TableCell
                  key={cell.column.columnDef.id}
                  cell={cell}
                  index={+index}
                  cells={centerVisibleCells}
                  selected={props.selected}
                  columnPosition={leftVisibleCells.length + +index + 1}
                  expanded={props.expanded}
                />
              );
            })}
            {rightVisibleCells.map((cell, index, cells) => {
              /** RIGHT CELL */

              return (
                <TableCell
                  key={cell.column.columnDef.id}
                  cell={cell}
                  index={index}
                  cells={cells}
                  columnPosition={leftVisibleCells.length + centerVisibleCells.length + index + 1}
                  selected={props.selected}
                  expanded={props.expanded}
                />
              );
            })}
          </>
        )}
        {!props.columnVirtualEnabled &&
          !props.CustomRow &&
          props.visibleCells.map((cell, index, cells) => {
            /** CELL */

            return (
              <TableCell
                key={cell.column.columnDef.id}
                cell={cell}
                index={index}
                cells={cells}
                columnPosition={index + 1}
                selected={props.selected}
                expanded={props.expanded}
              />
            );
          })}
        {props.CustomRow && props.CustomRow}
      </>
    </div>
  );
}) as <RowData extends DefaultRow>(props: Props<RowData>) => React.JSX.Element;

function isDragHandle(element: HTMLElement) {
  return (
    element.classList.contains("ksd-table-drag-handle") || element.closest(".ksd-table-drag-handle")
  );
}

function handleDragStart(event: React.DragEvent<HTMLElement>) {
  const target = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;

  if (!target || !isDragHandle(target)) {
    event.stopPropagation();
    event.preventDefault();

    return;
  }

  if (event.dataTransfer) {
    const index = event.currentTarget.getAttribute("data-index");
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
  event.currentTarget.style.background = "var(--table-row-drag-bg)";
}
function handleDragLeave(event: React.DragEvent<HTMLElement>) {
  if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node))
    event.currentTarget.style.background = "";
}
function handleDropGetter<RowData extends DefaultRow>(
  rows: RowInterface<RowData>[],
  onDraggableRow: DragRowHandler | undefined,
) {
  return function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.currentTarget.style.background = "";

    const sourceIndex = +event.dataTransfer?.getData?.("text");
    let targetIndex: number | string | null = event.currentTarget.getAttribute("data-index");
    if (targetIndex != undefined) targetIndex = +targetIndex;

    if (
      Number.isNaN(sourceIndex) ||
      targetIndex == undefined ||
      Number.isNaN(targetIndex) ||
      sourceIndex === targetIndex
    )
      return;

    const sourceId = rows[sourceIndex].id;
    const targetId = rows[targetIndex].id;

    onDraggableRow?.(sourceIndex, targetIndex, sourceId, targetId);
  };
}
