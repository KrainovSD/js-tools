import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { RowInterface } from "../../types";
import { TableCell } from "./table-cell";
import styles from "./table-row-virtual.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  rows: RowInterface<RowData>[];
  rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
  virtualRow: VirtualItem;
  columnsVirtual: VirtualItem[];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  columnVirtualEnabled: boolean;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
};

export const TableRowVirtual = React.memo(function TableRowVirtual<
  RowData extends Record<string, unknown>,
>(props: Props<RowData>) {
  const row = props.rows[props.virtualRow.index];
  const centerVisibleCells = row.getCenterVisibleCells();

  /** ROW */
  return (
    <tr
      data-id="row"
      key={row.id}
      className={clsx(
        styles.row,
        styles.row__virtual,
        typeof props.rowClassName === "function" ? props.rowClassName(row) : props.rowClassName,
      )}
      data-index={props.virtualRow.index}
      ref={(node) => props.rowVirtualizer.measureElement(node)}
      style={{
        transform: `translateY(${props.virtualRow.start}px)`, //this should always be a `style` as it changes on scrolls
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
            <td data-id="cell" style={{ display: "flex", width: props.virtualPaddingLeft }} />
          ) : null}
          {row.getLeftVisibleCells().map((cell, index, cells) => {
            /** CELL */

            return (
              <TableCell key={`${cell.id}-cell`} cell={cell} index={index} cells={cells} table />
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
                table
              />
            );
          })}
          {row.getRightVisibleCells().map((cell, index, cells) => {
            /** CELL */

            return (
              <TableCell key={`${cell.id}-cell`} cell={cell} index={index} cells={cells} table />
            );
          })}
          {props.virtualPaddingRight ? (
            <td data-id="cell" style={{ display: "flex", width: props.virtualPaddingRight }} />
          ) : null}
        </>
      )}
      {!props.columnVirtualEnabled &&
        row.getVisibleCells().map((cell, index, cells) => {
          /** CELL */

          return (
            <TableCell key={`${cell.id}-cell`} cell={cell} index={index} cells={cells} table />
          );
        })}
    </tr>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
