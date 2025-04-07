import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import { useGanttHeader } from "./hooks";
import styles from "./table-gantt.module.scss";
import { GANTT_HEADER_HEIGHT, GANTT_HEADER_WIDTH, GANTT_ROW_HEIGHT } from "./table.constants";
import type { GanttInfo, RowInterface, TableInterface } from "./types";

type TableContainerProps<RowData extends Record<string, unknown>> = {
  width?: number;
  firstGanttDate?: string;
  lastGanttDate?: string;
  ganttInfoGetter?: (row: RowInterface<RowData>) => GanttInfo;
  rows: RowInterface<RowData>[];
  columnVirtualEnabled: boolean;
  rowVirtualEnabled: boolean;
  table: TableInterface<RowData>;
  frozenHeader: boolean;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  columnsVirtual: VirtualItem[];
  rowsVirtual: VirtualItem[];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLTableRowElement>) => void;
  onDoubleClickRow?: (
    row: RowInterface<RowData>,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => void;
};

export function TableGantt<RowData extends Record<string, unknown>>(
  props: TableContainerProps<RowData>,
) {
  const headerItems = useGanttHeader({
    rows: props.rows,
    firstGanttDate: props.firstGanttDate,
    ganttInfoGetter: props.ganttInfoGetter,
    lastGanttDate: props.lastGanttDate,
  });

  const getCell = React.useCallback(
    (row: RowInterface<RowData>, table: TableInterface<RowData>) => {
      return (
        <td key={row.id} className={clsx(styles.cell)}>
          CELL
        </td>
      );
    },
    [],
  );

  if (!headerItems || !props.ganttInfoGetter) {
    console.warn("Required ganttInfoGetter");

    return null;
  }

  return (
    <table
      className={styles.table}
      style={{
        width: props.width ?? (props.columnVirtualEnabled ? props.table.getTotalSize() : "100%"),
      }}
    >
      <thead
        className={clsx(
          styles.header,
          (props.frozenHeader || props.frozenHeader == undefined) && styles.header__frozen,
        )}
        style={{ minHeight: 60 }}
      >
        <tr
          className={styles.headerRow}
          style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
        >
          {headerItems.map((item) => {
            return (
              <th
                className={styles.headerCell}
                key={item.main}
                style={{
                  minWidth: GANTT_HEADER_WIDTH * item.inner.length,
                  maxWidth: GANTT_HEADER_WIDTH * item.inner.length,
                }}
              >
                {item.main}
              </th>
            );
          })}
        </tr>
        <tr
          className={styles.headerRow}
          style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
        >
          {headerItems.map((item) => {
            return item.inner.map((inner) => {
              return (
                <th
                  className={styles.headerCell}
                  key={`${item.main}${inner}`}
                  style={{ minWidth: GANTT_HEADER_WIDTH }}
                >
                  {inner}
                </th>
              );
            });
          })}
        </tr>
      </thead>
      <tbody
        className={styles.body}
        style={{
          height: props.rowVirtualEnabled ? `${props.rowVirtualizer.getTotalSize()}px` : undefined,
        }}
      >
        {props.rowVirtualEnabled &&
          props.rowsVirtual.map((virtualRow) => {
            const row = props.rows[virtualRow.index];

            /** ROW */
            return (
              <tr
                key={row.id}
                className={clsx(styles.row, styles.row__virtual)}
                data-index={virtualRow.index}
                style={{
                  transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scrolls
                  minHeight: GANTT_ROW_HEIGHT,
                  maxHeight: GANTT_ROW_HEIGHT,
                }}
                onClick={(event) => {
                  props.onClickRow?.(row, event);
                }}
                onDoubleClick={(event) => {
                  props.onDoubleClickRow?.(row, event);
                }}
              >
                {getCell(row, props.table)}
              </tr>
            );
          })}
        {!props.rowVirtualEnabled &&
          props.rows.map((row) => {
            /** ROW */
            return (
              <tr
                key={row.id}
                className={styles.row}
                data-index={row.index}
                onClick={(event) => {
                  props.onClickRow?.(row, event);
                }}
                onDoubleClick={(event) => {
                  props.onDoubleClickRow?.(row, event);
                }}
                style={{
                  minHeight: GANTT_ROW_HEIGHT,
                  maxHeight: GANTT_ROW_HEIGHT,
                }}
              >
                {getCell(row, props.table)}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
