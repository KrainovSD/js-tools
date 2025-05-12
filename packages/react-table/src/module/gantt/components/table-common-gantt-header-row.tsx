import type { VirtualItem } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { HeaderInterface } from "../../../types";
import { TableHeaderCell } from "../../table/table-header-cell";
import styles from "./table-common-gantt-header-row.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  headerGroup: HeaderInterface<RowData>;
  rowHeaderHeight: number;
  columnVirtualEnabled: boolean;
  columnsVirtual: VirtualItem[];
  leftHeaders: HeaderInterface<RowData>["headers"];
  rightHeaders: HeaderInterface<RowData>["headers"];
  centerHeaders: HeaderInterface<RowData>["headers"];
  totalWidth: number;
  headerRowClassName:
    | ((header: HeaderInterface<RowData>) => string | undefined)
    | string
    | undefined;
};

export const TableCommonGanttHeaderRow = React.memo(function TableCommonGanttHeaderRow<
  RowData extends Record<string, unknown>,
>(props: Props<RowData>) {
  return (
    <div
      key={props.headerGroup.id}
      className={clsx(
        styles.headerRow,
        typeof props.headerRowClassName === "function"
          ? props.headerRowClassName(props.headerGroup)
          : props.headerRowClassName,
      )}
      style={{
        minHeight: props.rowHeaderHeight,
        maxHeight: props.rowHeaderHeight,
        width: props.totalWidth,
      }}
      data-id="header-row"
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
    </div>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
