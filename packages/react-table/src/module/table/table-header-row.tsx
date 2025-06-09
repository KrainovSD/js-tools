import type { ColumnFiltersState, HeaderGroup, SortingState } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import type { HeaderInterface } from "../../types";
import { TableHeaderCell } from "./table-header-cell";
import styles from "./table-header-row.module.scss";

type Props<RowData extends Record<string, unknown>> = {
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
                key={`${header.id}-cell`}
                header={header}
                headers={props.centerHeaders}
                index={+index}
                semanticTag
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
                key={`${header.id}-cell`}
                header={header}
                headers={headers}
                index={index}
                semanticTag
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
              key={`${header.id}-cell`}
              header={header}
              headers={headers}
              index={index}
              semanticTag
              columnPosition={index + 1}
              filterState={props.filterState}
              selectedPage={props.selectedPage}
              sortState={props.sortState}
            />
          );
        })}
    </tr>
  );
}) as <RowData extends Record<string, unknown>>(props: Props<RowData>) => React.JSX.Element;
