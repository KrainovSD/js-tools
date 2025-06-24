import type { Cell } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../../table.constants";
import type { RowInterface } from "../../../types";
import { TableCell } from "../../table/table-cell";
import styles from "./table-common-gantt-row.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  rows: RowInterface<RowData>[];
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
  ganttRowMini: boolean | undefined;
  selected: boolean;
  visibleCells: Cell<RowData, unknown>[];
  expanded: boolean;
};

export const TableCommonGanttRow = React.memo(function TableCommonGanttRow<
  RowData extends Record<string, unknown>,
>(props: Props<RowData>) {
  const row = props.virtualRow ? props.rows[props.virtualRow.index] : props.row;

  if (!row) return;
  const leftVisibleCells = row.getLeftVisibleCells();
  const centerVisibleCells = row.getCenterVisibleCells();
  const rightVisibleCells = row.getRightVisibleCells();

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
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
      onClick={(event) => {
        props.onClickRow?.(row, event);
      }}
      onDoubleClick={(event) => {
        props.onDoubleClickRow?.(row, event);
      }}
      style={{
        transform: props.virtualRow ? `translateY(${props.virtualRow.start}px)` : undefined,
        minHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
        maxHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
      }}
    >
      <>
        {props.columnVirtualEnabled && (
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
                  columnPosition={leftVisibleCells.length + +index + 1}
                  selected={props.selected}
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
      </>
    </div>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
