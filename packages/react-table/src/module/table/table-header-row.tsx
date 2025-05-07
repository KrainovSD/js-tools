import type { HeaderGroup } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import React from "react";
import type { TableInterface } from "../../types";
import { TableHeaderCell } from "./table-header-cell";
import styles from "./table-header-row.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  headerGroup: HeaderGroup<RowData>;
  columnVirtualEnabled: boolean;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  columnsVirtual: VirtualItem[];
  leftHeaders: HeaderGroup<RowData>["headers"];
  rightHeaders: HeaderGroup<RowData>["headers"];
  centerHeaders: HeaderGroup<RowData>["headers"];
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  table: TableInterface<RowData>;
};

export const TableHeaderRow = React.memo(function TableHeaderRow<
  RowData extends Record<string, unknown>,
>(props: Props<RowData>) {
  return (
    <tr
      key={`${props.headerGroup.id}-row`}
      className={styles.headerRow}
      data-id="header-row"
      style={{ width: props.table.getTotalSize() }}
    >
      {props.columnVirtualEnabled && (
        <>
          {props.leftHeaders.map((header, index, headers) => {
            return (
              <TableHeaderCell
                key={`${header.id}-cell`}
                header={header}
                headers={headers}
                index={index}
                table
              />
            );
          })}
          {props.columnsVirtual.map((virtualColumn) => {
            /** CELL HEADER  */
            const header = props.centerHeaders[virtualColumn.index];

            return (
              <TableHeaderCell
                key={`${header.id}-cell`}
                header={header}
                headers={props.centerHeaders}
                index={virtualColumn.index}
                left={virtualColumn.start}
                table
              />
            );
          })}
          {props.rightHeaders.map((header, index, headers) => {
            return (
              <TableHeaderCell
                key={`${header.id}-cell`}
                header={header}
                headers={headers}
                index={index}
                table
              />
            );
          })}
        </>
      )}
      {!props.columnVirtualEnabled &&
        props.headerGroup.headers.map((header, index, headers) => {
          return (
            <TableHeaderCell
              key={`${header.id}-cell`}
              header={header}
              headers={headers}
              index={index}
              table
            />
          );
        })}
    </tr>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
