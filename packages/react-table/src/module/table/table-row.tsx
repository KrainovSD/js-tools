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
};

export const TableRow = React.memo(function TableRow<RowData extends Record<string, unknown>>(
  props: Props<RowData>,
) {
  const row = props.virtualRow ? props.rows[props.virtualRow.index] : props.row;

  if (!row) return;
  const leftVisibleCells = row.getLeftVisibleCells();
  const centerVisibleCells = row.getCenterVisibleCells();
  const rightVisibleCells = row.getRightVisibleCells();
  const visibleCells = row.getVisibleCells();

  /** ROW */
  return (
    <tr
      data-id="row"
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
      }}
      onClick={(event) => {
        props.onClickRow?.(row, event);
      }}
      onDoubleClick={(event) => {
        props.onDoubleClickRow?.(row, event);
      }}
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
                  semanticTag
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
                  semanticTag
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
                  semanticTag
                  columnPosition={leftVisibleCells.length + centerVisibleCells.length + index + 1}
                  selected={props.selected}
                />
              );
            })}
          </>
        )}
        {!props.columnVirtualEnabled &&
          !props.CustomRow &&
          visibleCells.map((cell, index, cells) => {
            /** CELL */

            return (
              <TableCell
                key={`${cell.id}-cell`}
                cell={cell}
                index={index}
                cells={cells}
                semanticTag
                columnPosition={index + 1}
                selected={props.selected}
              />
            );
          })}
        {props.CustomRow && props.CustomRow}
      </>
    </tr>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
