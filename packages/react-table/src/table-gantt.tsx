import { dateFormat } from "@krainovsd/js-helpers";
import { Tooltip } from "@krainovsd/react-ui";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import { useGanttHeader } from "./hooks";
import { getMonthDifference } from "./lib";
import styles from "./table-gantt.module.scss";
import {
  GANTT_HEADER_HEIGHT,
  GANTT_HEADER_WIDTH,
  GANTT_ROW_HEIGHT,
  GANTT_ROW_HEIGHT_MINI,
} from "./table.constants";
import type { GanttInfo, RowInterface, TableInterface } from "./types";

type TableContainerProps<RowData extends Record<string, unknown>> = {
  width?: number;
  firstGanttDate?: string;
  lastGanttDate?: string;
  ganttRowMini?: boolean;
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
  GanttTooltip?: React.FC<{ row: RowInterface<RowData> }>;
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
      const ganttInfo = props.ganttInfoGetter?.(row);
      if (!ganttInfo || !headerItems) return null;

      const startDate = new Date(ganttInfo.start);
      const endDate = new Date(ganttInfo.end);
      const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

      const monthWidth = getMonthDifference(startDate, endDate) * GANTT_HEADER_WIDTH;
      const startWidth = (GANTT_HEADER_WIDTH / 30) * startDate.getDate();
      const endWidth = (GANTT_HEADER_WIDTH / 30) * endDate.getDate();
      let height = props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI / 2 : GANTT_ROW_HEIGHT / 2;
      if (ganttInfo.type === "milestone") {
        height /= 1.5;
      }

      let width = monthWidth + endWidth - startWidth;
      if (width < 15) width = 15;
      if (ganttInfo.type === "milestone") {
        width = height;
      }
      const textWidth = ganttInfo.name.length * 6 + 20;

      let startCell;
      {
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        if (headerItems[0].year < startYear) {
          startCell = headerItems[0].months.length;
          const diff = startYear - headerItems[0].year - 1;
          for (let i = 0; i < diff; i++) {
            startCell += 12;
          }
          startCell += startMonth;
        } else {
          startCell = startMonth - headerItems[0].months[0];
        }
      }

      return (
        <td key={row.id} className={clsx(styles.cell)}>
          <Tooltip
            styleBase={{
              left: startCell * GANTT_HEADER_WIDTH + startWidth - 8,
              width: "fit-content",
              position: "relative",
            }}
            classNameBaseContainer={styles.item__container}
            zIndex={10}
            text={
              props.GanttTooltip ? (
                <props.GanttTooltip row={row} />
              ) : (
                <div className={styles.tooltip}>
                  <span className={styles.tooltip__header}>Задача:</span>
                  <span>{ganttInfo.name}</span>
                  <span className={styles.tooltip__header}>Начало:</span>
                  <span>{dateFormat(startDate, "DD-MM-YYYY")}</span>
                  <span className={styles.tooltip__header}>Оконание:</span>
                  <span>{dateFormat(endDate, "DD-MM-YYYY")}</span>
                  <span className={styles.tooltip__header}>Продолжительность:</span>
                  <span>{duration}</span>
                </div>
              )
            }
          >
            <div
              className={clsx(
                styles.item,
                ganttInfo.type === "group" && styles.item__group,
                ganttInfo.type === "task" && styles.item__task,
                ganttInfo.type === "milestone" && styles.item__milestone,
              )}
              style={{
                height,
                width,
                minWidth: width,
                maxWidth: width,
              }}
            >
              {textWidth <= width && <span className={styles.item__text}>{ganttInfo.name}</span>}
            </div>
            {textWidth > width && <span className={styles.item__text}>{ganttInfo.name}</span>}
          </Tooltip>
        </td>
      );
    },
    [headerItems, props.ganttInfoGetter],
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
                key={item.year}
                style={{
                  minWidth: GANTT_HEADER_WIDTH * item.months.length,
                  maxWidth: GANTT_HEADER_WIDTH * item.months.length,
                }}
              >
                {item.year}
              </th>
            );
          })}
        </tr>
        <tr
          className={styles.headerRow}
          style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
        >
          {headerItems.map((item) => {
            return item.months.map((month) => {
              return (
                <th
                  className={styles.headerCell}
                  key={`${item.year}${month}`}
                  style={{ minWidth: GANTT_HEADER_WIDTH }}
                >
                  {month}
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
                  minHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
                  maxHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
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
                  minHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
                  maxHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
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
