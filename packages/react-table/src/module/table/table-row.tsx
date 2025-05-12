import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { RowInterface } from "../../types";
import { TableCell } from "./table-cell";
import styles from "./table-row.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  rows: RowInterface<RowData>[];
  row: RowInterface<RowData> | null;
  totalWidth: number;
  columnsVirtual: VirtualItem[];
  virtualRow: VirtualItem | null;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  columnVirtualEnabled: boolean;
};

export const TableRow = React.memo(function TableRow<RowData extends Record<string, unknown>>(
  props: Props<RowData>,
) {
  const row = props.virtualRow ? props.rows[props.virtualRow.index] : props.row;

  if (!row) return;
  const centerVisibleCells = row.getCenterVisibleCells();

  /** ROW */
  return (
    <tr
      data-id="row"
      key={row.id}
      className={clsx(
        styles.row,
        props.virtualRow && styles.row__virtual,
        typeof props.rowClassName === "function" ? props.rowClassName(row) : props.rowClassName,
      )}
      data-index={props.virtualRow ? props.virtualRow.index : row.index}
      ref={props.virtualRow ? (node) => props.rowVirtualizer.measureElement(node) : undefined}
      style={{
        transform: props.virtualRow ? `translateY(${props.virtualRow.start}px)` : undefined,
        width: props.totalWidth,
      }}
      onClick={(event) => {
        props.onClickRow?.(row, event);
      }}
      onDoubleClick={(event) => {
        props.onDoubleClickRow?.(row, event);
      }}
    >
      <>
        {props.columnVirtualEnabled && (
          <>
            {row.getLeftVisibleCells().map((cell, index, cells) => {
              /** CELL */

              return (
                <TableCell
                  key={`${cell.id}-cell`}
                  cell={cell}
                  index={index}
                  cells={cells}
                  semanticTag
                />
              );
            })}
            {props.columnsVirtual.map((virtualColumn) => {
              /** CELL */

              const cell = centerVisibleCells[virtualColumn.index];

              return (
                <TableCell
                  key={`${cell.id}-cell`}
                  cell={cell}
                  index={virtualColumn.index}
                  cells={centerVisibleCells}
                  virtualLeft={virtualColumn.start}
                  semanticTag
                />
              );
            })}
            {row.getRightVisibleCells().length > 0 && <div className={styles.ghost}></div>}
            {row.getRightVisibleCells().map((cell, index, cells) => {
              /** CELL */

              return (
                <TableCell
                  key={`${cell.id}-cell`}
                  cell={cell}
                  index={index}
                  cells={cells}
                  semanticTag
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
                semanticTag
              />
            );
          })}
      </>
    </tr>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
