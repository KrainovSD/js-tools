import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { RowInterface } from "../../types";
import { TableRow } from "./table-row";
import styles from "./table-row-wrapper.module.scss";

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

export const TableRowWrapper = React.memo(function TableRowWrapper<
  RowData extends Record<string, unknown>,
>(props: Props<RowData>) {
  const row = props.virtualRow ? props.rows[props.virtualRow.index] : props.row;

  if (!row) return;

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
      <TableRow
        columnVirtualEnabled={props.columnVirtualEnabled}
        columnsVirtual={props.columnsVirtual}
        row={row}
      />
    </tr>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
