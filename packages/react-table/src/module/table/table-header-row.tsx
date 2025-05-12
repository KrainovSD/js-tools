import type { HeaderGroup } from "@tanstack/react-table";
import type { VirtualItem } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { HeaderInterface } from "../../types";
import { TableHeaderCell } from "./table-header-cell";
import styles from "./table-header-row.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  headerGroup: HeaderGroup<RowData>;
  columnVirtualEnabled: boolean;
  columnsVirtual: VirtualItem[];
  leftHeaders: HeaderGroup<RowData>["headers"];
  rightHeaders: HeaderGroup<RowData>["headers"];
  centerHeaders: HeaderGroup<RowData>["headers"];
  totalWidth: number;
  headerRowClassName:
    | ((header: HeaderInterface<RowData>) => string | undefined)
    | string
    | undefined;
};

export const TableHeaderRow = React.memo(function TableHeaderRow<
  RowData extends Record<string, unknown>,
>(props: Props<RowData>) {
  return (
    <tr
      key={`${props.headerGroup.id}-row`}
      className={clsx(
        styles.headerRow,
        typeof props.headerRowClassName === "function"
          ? props.headerRowClassName(props.headerGroup)
          : props.headerRowClassName,
      )}
      data-id="header-row"
      style={{ width: props.totalWidth }}
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
                semanticTag
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
                virtualLeft={virtualColumn.start}
                semanticTag
              />
            );
          })}
          {props.rightHeaders.length > 0 && <div className={styles.ghost}></div>}
          {props.rightHeaders.map((header, index, headers) => {
            return (
              <TableHeaderCell
                key={`${header.id}-cell`}
                header={header}
                headers={headers}
                index={index}
                semanticTag
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
              semanticTag
            />
          );
        })}
    </tr>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
