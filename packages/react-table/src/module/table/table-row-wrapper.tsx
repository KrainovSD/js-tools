import type { VirtualItem } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { RowInterface, TableInterface } from "../../types";
import { TableRow } from "./table-row";
import styles from "./table-row-wrapper.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  row: RowInterface<RowData>;
  table: TableInterface<RowData>;

  columnsVirtual: VirtualItem[];
  rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  columnVirtualEnabled: boolean;
};

export const TableRowWrapper = React.memo(function TableRowWrapper<
  RowData extends Record<string, unknown>,
>(props: Props<RowData>) {
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
      style={{
        width: props.table.getTotalSize(),
      }}
      data-index={props.row.index}
      onClick={(event) => {
        props.onClickRow?.(props.row, event);
      }}
      onDoubleClick={(event) => {
        props.onDoubleClickRow?.(props.row, event);
      }}
    >
      <TableRow
        columnVirtualEnabled={props.columnVirtualEnabled}
        columnsVirtual={props.columnsVirtual}
        row={props.row}
      />
    </tr>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
