import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { RowInterface } from "../../types";
import { TableRow } from "./table-row";
import styles from "./table-row-wrapper.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  rows: RowInterface<RowData>[];
  rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
  virtualRow: VirtualItem;
  columnsVirtual: VirtualItem[];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  columnVirtualEnabled: boolean;
  totalWidth: number;
};

export const TableRowVirtualWrapper = React.memo(function TableRowVirtual<
  RowData extends Record<string, unknown>,
>(props: Props<RowData>) {
  const row = props.rows[props.virtualRow.index];

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
        transform: `translateY(${props.virtualRow.start}px)`,
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
