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
  totalWidth: number;
  columnsVirtual: VirtualItem[];
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
};

export const TableCommonGanttRow = React.memo(function TableCommonGanttRow<
  RowData extends Record<string, unknown>,
>(props: Props<RowData>) {
  const row = props.virtualRow ? props.rows[props.virtualRow.index] : props.row;

  if (!row) return;
  const leftVisibleCells = row.getLeftVisibleCells();
  const centerVisibleCells = row.getCenterVisibleCells();
  const rightVisibleCells = row.getRightVisibleCells();
  const visibleCells = row.getVisibleCells();

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
        gridTemplateColumns: visibleCells.map((cell) => `${cell.column.getSize()}px`).join(" "),
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
            {props.columnsVirtual.map((virtualColumn) => {
              /** CENTER CELL */

              const cell = centerVisibleCells[virtualColumn.index];

              return (
                <TableCell
                  key={`${cell.id}-cell`}
                  cell={cell}
                  index={virtualColumn.index}
                  cells={centerVisibleCells}
                  columnPosition={leftVisibleCells.length + virtualColumn.index + 1}
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
          row.getVisibleCells().map((cell, index, cells) => {
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
