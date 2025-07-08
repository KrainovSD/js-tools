import type { ColumnFiltersState, HeaderGroup, SortingState } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import type { DefaultRow, HeaderInterface } from "../../types";
import { TableHeaderCell } from "./table-header-cell";
import styles from "./table-header-row.module.scss";

type Props<RowData extends DefaultRow> = {
  headerGroup: HeaderGroup<RowData>;
  columnVirtualEnabled: boolean;
  columnsVirtual: string[];
  leftHeaders: HeaderGroup<RowData>["headers"];
  rightHeaders: HeaderGroup<RowData>["headers"];
  centerHeaders: HeaderGroup<RowData>["headers"];
  headerRowClassName:
    | ((header: HeaderInterface<RowData>) => string | undefined)
    | string
    | undefined;
  page: number;
  selectedPage: boolean;
  filterState: ColumnFiltersState;
  sortState: SortingState;
  height: number | undefined;
};

export const TableHeaderRow = React.memo(function TableHeaderRow<RowData extends DefaultRow>(
  props: Props<RowData>,
) {
  return (
    <div
      role="rowheader"
      key={`${props.headerGroup.id}-row`}
      className={clsx(
        styles.headerRow,
        typeof props.headerRowClassName === "function"
          ? props.headerRowClassName(props.headerGroup)
          : props.headerRowClassName,
      )}
      data-id="header-row"
      style={{
        minHeight: props.height,
        maxHeight: props.height,
      }}
    >
      {props.columnVirtualEnabled && (
        <>
          {props.leftHeaders.map((header, index, headers) => {
            return (
              <TableHeaderCell
                key={header.column.columnDef.id}
                header={header}
                headers={headers}
                index={index}
                columnPosition={index + 1}
                filterState={props.filterState}
                selectedPage={props.selectedPage}
                sortState={props.sortState}
              />
            );
          })}
          {props.columnsVirtual.map((index) => {
            /** CELL HEADER  */
            const header = props.centerHeaders[+index];

            return (
              <TableHeaderCell
                key={header.column.columnDef.id}
                header={header}
                headers={props.centerHeaders}
                index={+index}
                columnPosition={props.leftHeaders.length + +index + 1}
                filterState={props.filterState}
                selectedPage={props.selectedPage}
                sortState={props.sortState}
              />
            );
          })}
          {props.rightHeaders.map((header, index, headers) => {
            return (
              <TableHeaderCell
                key={header.column.columnDef.id}
                header={header}
                headers={headers}
                index={index}
                columnPosition={props.leftHeaders.length + props.centerHeaders.length + index + 1}
                filterState={props.filterState}
                selectedPage={props.selectedPage}
                sortState={props.sortState}
              />
            );
          })}
        </>
      )}
      {!props.columnVirtualEnabled &&
        props.headerGroup.headers.map((header, index, headers) => {
          return (
            <TableHeaderCell
              key={header.column.columnDef.id}
              header={header}
              headers={headers}
              index={index}
              columnPosition={index + 1}
              filterState={props.filterState}
              selectedPage={props.selectedPage}
              sortState={props.sortState}
            />
          );
        })}
    </div>
  );
}) as <RowData extends DefaultRow>(props: Props<RowData>) => React.JSX.Element;
