import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type { HeaderInterface, RowInterface, TableInterface } from "../../types";
import { TableCommonGanttHeaderRow, TableCommonGanttRow } from "./components";
import { GANTT_COMMON_TABLE_BODY_ID, GANTT_COMMON_TABLE_HEADER_ID } from "./gantt.constants";
import styles from "./table-common-gantt.module.scss";

type TableContainerProps<RowData extends Record<string, unknown>> = {
  width?: number;
  rowHeaderHeight: number;
  tableRef?: React.LegacyRef<HTMLTableElement>;
  ganttRowMini?: boolean;
  columnVirtualEnabled: boolean;
  rowVirtualEnabled: boolean;
  table: TableInterface<RowData>;
  frozenHeader: boolean;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  columnsVirtual: VirtualItem[];
  rowsVirtual: VirtualItem[];
  rows: RowInterface<RowData>[];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
  headerRowClassName:
    | ((header: HeaderInterface<RowData>) => string | undefined)
    | string
    | undefined;
};

export function TableCommonGantt<RowData extends Record<string, unknown>>(
  props: TableContainerProps<RowData>,
) {
  const leftHeadersGroup = props.table.getLeftHeaderGroups();
  const centerHeadersGroup = props.table.getCenterHeaderGroups();
  const rightHeadersGroup = props.table.getRightHeaderGroups();
  const visibleHeadersGroup = props.table.getHeaderGroups();

  const virtualColumnsIndexesKey =
    props.columnsVirtual.length === 0
      ? null
      : props.columnsVirtual.map((virtual) => virtual.index).join(";");
  const virtualColumns = React.useMemo(() => {
    return virtualColumnsIndexesKey ? virtualColumnsIndexesKey.split(";") : [];
  }, [virtualColumnsIndexesKey]);

  const visibleHeaders = visibleHeadersGroup?.[0]?.headers ?? [];

  return (
    <div
      ref={props.tableRef}
      className={styles.table}
      style={
        {
          width: props.width,
          "--table-template-columns": visibleHeaders
            .map((header) => `${header.getSize()}px`)
            .join(" "),
          "--table-total-width": props.table.getTotalSize(),
        } as React.CSSProperties
      }
      data-id="table"
    >
      <div
        id={GANTT_COMMON_TABLE_HEADER_ID}
        className={clsx(
          styles.headerContainer,
          (props.frozenHeader || props.frozenHeader == undefined) && styles.headerContainer__frozen,
        )}
        data-id="header-container"
      >
        <div className={clsx(styles.header)} data-id="header">
          {props.table.getHeaderGroups().map((headerGroup, index) => {
            /** ROW HEADER */
            const leftHeaders = leftHeadersGroup[index].headers;
            const centerHeaders = centerHeadersGroup[index].headers;
            const rightHeaders = rightHeadersGroup[index].headers;

            const selected = props.table.getIsAllPageRowsSelected();

            return (
              <TableCommonGanttHeaderRow<RowData>
                key={`${headerGroup.id}-header-row`}
                columnVirtualEnabled={props.columnVirtualEnabled}
                columnsVirtual={virtualColumns}
                headerGroup={headerGroup}
                centerHeaders={centerHeaders}
                leftHeaders={leftHeaders}
                rightHeaders={rightHeaders}
                headerRowClassName={props.headerRowClassName}
                rowHeaderHeight={props.rowHeaderHeight}
                selectedPage={selected}
              />
            );
          })}
        </div>
      </div>
      <div
        data-id="body-container"
        className={styles.bodyContainer}
        id={GANTT_COMMON_TABLE_BODY_ID}
      >
        <div
          className={styles.body}
          style={{
            height: props.rowVirtualEnabled
              ? `${props.rowVirtualizer.getTotalSize()}px`
              : undefined,
            width: props.table.getTotalSize(),
          }}
          data-id="body"
        >
          {props.rowVirtualEnabled &&
            props.rowsVirtual.map((virtualRow) => {
              const selected = props.rows[virtualRow.index]?.getIsSelected?.();

              return (
                <TableCommonGanttRow<RowData>
                  virtualRow={virtualRow}
                  columnVirtualEnabled={props.columnVirtualEnabled}
                  columnsVirtual={virtualColumns}
                  rowClassName={props.rowClassName}
                  rows={props.rows}
                  key={`${virtualRow.index}-row`}
                  onClickRow={props.onClickRow}
                  onDoubleClickRow={props.onDoubleClickRow}
                  rowVirtualizer={props.rowVirtualizer}
                  row={null}
                  ganttRowMini={props.ganttRowMini}
                  selected={selected}
                />
              );
            })}
          {!props.rowVirtualEnabled &&
            props.rows.map((row) => {
              const selected = row.getIsSelected();

              return (
                <TableCommonGanttRow<RowData>
                  columnVirtualEnabled={props.columnVirtualEnabled}
                  columnsVirtual={virtualColumns}
                  row={row}
                  rowClassName={props.rowClassName}
                  key={`${row.id}-row`}
                  onClickRow={props.onClickRow}
                  onDoubleClickRow={props.onDoubleClickRow}
                  rowVirtualizer={props.rowVirtualizer}
                  rows={props.rows}
                  virtualRow={null}
                  ganttRowMini={props.ganttRowMini}
                  selected={selected}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
