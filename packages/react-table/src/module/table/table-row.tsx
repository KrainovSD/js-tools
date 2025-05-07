import type { VirtualItem } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { RowInterface } from "../../types";
import { TableCell } from "./table-cell";
import styles from "./table-row.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  row: RowInterface<RowData>;
  columnsVirtual: VirtualItem[];
  rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  columnVirtualEnabled: boolean;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
};

export const TableRow = React.memo(function TableRow<RowData extends Record<string, unknown>>(
  props: Props<RowData>,
) {
  const visibleCells = props.row.getVisibleCells();

  /** ROW */
  return (
    <tr
      data-id="row"
      key={props.row.id}
      className={clsx(
        styles.row,
        typeof props.rowClassName === "function"
          ? props.rowClassName(props.row)
          : props.rowClassName,
      )}
      data-index={props.row.index}
      onClick={(event) => {
        props.onClickRow?.(props.row, event);
      }}
      onDoubleClick={(event) => {
        props.onDoubleClickRow?.(props.row, event);
      }}
    >
      {props.columnVirtualEnabled && (
        <>
          {props.virtualPaddingLeft ? (
            <td data-id="cell" style={{ display: "flex", width: props.virtualPaddingLeft }} />
          ) : null}
          {props.columnsVirtual.map((virtualColumn) => {
            /** CELL */
            const cell = visibleCells[virtualColumn.index];

            return (
              <TableCell
                key={`${cell.id}-cell`}
                cell={cell}
                index={virtualColumn.index}
                cells={visibleCells}
                table
              />
            );
          })}
          {props.virtualPaddingRight ? (
            <td data-id="cell" style={{ display: "flex", width: props.virtualPaddingRight }} />
          ) : null}
        </>
      )}
      {!props.columnVirtualEnabled &&
        visibleCells.map((cell, index, cells) => {
          /** CELL */

          return (
            <TableCell key={`${cell.id}-cell`} cell={cell} index={index} cells={cells} table />
          );
        })}
    </tr>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
