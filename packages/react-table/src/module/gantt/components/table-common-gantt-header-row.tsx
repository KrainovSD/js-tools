import clsx from "clsx";
import React from "react";
import type { HeaderInterface } from "../../../types";
import { TableHeaderCell } from "../../table/table-header-cell";
import styles from "./table-common-gantt-header-row.module.scss";

type Props<RowData extends Record<string, unknown>> = {
  headerGroup: HeaderInterface<RowData>;
  rowHeaderHeight: number;
  columnVirtualEnabled: boolean;
  columnsVirtual: string[];
  leftHeaders: HeaderInterface<RowData>["headers"];
  rightHeaders: HeaderInterface<RowData>["headers"];
  centerHeaders: HeaderInterface<RowData>["headers"];
  headerRowClassName:
    | ((header: HeaderInterface<RowData>) => string | undefined)
    | string
    | undefined;
  selectedPage: boolean;
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
                columnPosition={index + 1}
                selectedPage={props.selectedPage}
              />
            );
          })}
          {props.columnsVirtual.map((index) => {
            /** CELL HEADER  */
            const header = props.centerHeaders[+index];

            return (
              <TableHeaderCell
                key={`${header.id}-cell`}
                header={header}
                headers={props.centerHeaders}
                index={+index}
                selectedPage={props.selectedPage}
                columnPosition={props.leftHeaders.length + +index + 1}
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
                columnPosition={props.leftHeaders.length + props.centerHeaders.length + index + 1}
                selectedPage={props.selectedPage}
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
              columnPosition={index + 1}
              selectedPage={props.selectedPage}
            />
          );
        })}
    </div>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
