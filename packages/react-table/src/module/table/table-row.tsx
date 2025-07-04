import type { Cell } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { RowInterface } from "../../types";
import { TableCell } from "./table-cell";
import styles from "./table-row.module.scss";

type Props<RowData extends Record<string, unknown>> = {
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
};

export const TableRow = React.memo(function TableRow<RowData extends Record<string, unknown>>(
  props: Props<RowData>,
) {
  const row = props.virtualRow ? props.rows[props.virtualRow.index] : props.row;

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
    >
      <>
        {props.columnVirtualEnabled && !props.CustomRow && (
          <>
            {leftVisibleCells.map((cell, index, cells) => {
              /** LEFT CELL */

              return (
                <TableCell
                  key={`${cell.id}-cell`}
                  cell={cell}
                  index={index}
                  cells={cells}
                  columnPosition={index + 1}
                  selected={props.selected}
                />
              );
            })}
            {props.columnsVirtual.map((index) => {
              /** CENTER CELL */

              const cell = centerVisibleCells[+index];

              return (
                <TableCell
                  key={`${cell.id}-cell`}
                  cell={cell}
                  index={+index}
                  cells={centerVisibleCells}
                  selected={props.selected}
                  columnPosition={leftVisibleCells.length + +index + 1}
                />
              );
            })}
            {rightVisibleCells.map((cell, index, cells) => {
              /** RIGHT CELL */

              return (
                <TableCell
                  key={`${cell.id}-cell`}
                  cell={cell}
                  index={index}
                  cells={cells}
                  columnPosition={leftVisibleCells.length + centerVisibleCells.length + index + 1}
                  selected={props.selected}
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
                key={`${cell.id}-cell`}
                cell={cell}
                index={index}
                cells={cells}
                columnPosition={index + 1}
                selected={props.selected}
              />
            );
          })}
        {props.CustomRow && props.CustomRow}
      </>
    </div>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
