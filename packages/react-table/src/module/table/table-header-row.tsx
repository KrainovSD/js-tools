import type { HeaderGroup } from "@tanstack/react-table";
import type { VirtualItem } from "@tanstack/react-virtual";
import React from "react";
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
};

export const TableHeaderRow = React.memo(function TableHeaderRow<
  RowData extends Record<string, unknown>,
>(props: Props<RowData>) {
  return (
    <tr key={`${props.headerGroup.id}-row`} className={styles.headerRow} data-id="header-row">
      {props.columnVirtualEnabled && (
        <>
          {props.virtualPaddingLeft ? (
            <th
              style={{ display: "flex", width: props.virtualPaddingLeft }}
              data-id="header-cell"
            />
          ) : null}
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
          {props.virtualPaddingRight ? (
            <th
              style={{ display: "flex", width: props.virtualPaddingRight }}
              data-id="header-cell"
            />
          ) : null}
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
