import { dateFormat } from "@krainovsd/js-helpers";
import { Tooltip } from "@krainovsd/react-ui";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import { GanttArrow } from "./components";
import { useGanttHeader } from "./hooks";
import { getMonthDifference } from "./lib";
import styles from "./table-gantt.module.scss";
import {
  GANTT_BODY_ID,
  GANTT_HEADER_HEIGHT,
  GANTT_HEADER_ID,
  GANTT_HEADER_WIDTH,
  GANTT_ROW_HEIGHT,
  GANTT_ROW_HEIGHT_MINI,
  GANTT_ROW_PADDING,
} from "./table.constants";
import type { GanttInfo, GanttRowInfo, RowInterface, TableInterface } from "./types";

type TableContainerProps<RowData extends Record<string, unknown>> = {
  width?: number;
  tableRef?: React.LegacyRef<HTMLTableElement>;
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
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  GanttTooltip?: React.FC<{ row: RowInterface<RowData> }>;
};

type GetCellOptions<RowData extends Record<string, unknown>> = {
  ganttInfoGetter: ((row: RowInterface<RowData>) => GanttInfo) | undefined;
  GanttTooltip:
    | React.FC<{
        row: RowInterface<RowData>;
      }>
    | undefined;
  rowsMap: Record<string | number, GanttRowInfo>;
  row: RowInterface<RowData>;
  mini: boolean;
};

export function TableGantt<RowData extends Record<string, unknown>>(
  props: TableContainerProps<RowData>,
) {
  const arrowContainerRef = React.useRef<HTMLTableSectionElement | null>(null);

  const headerItems = useGanttHeader({
    rows: props.rows,
    firstGanttDate: props.firstGanttDate,
    ganttInfoGetter: props.ganttInfoGetter,
    lastGanttDate: props.lastGanttDate,
  });

  const rowsMap = React.useMemo(() => {
    const rowsMap: Record<string | number, GanttRowInfo> = {};

    for (let i = 0; i < props.rows.length; i++) {
      const row = props.rows[i];
      const ganttInfo = props.ganttInfoGetter?.(row);
      if (!ganttInfo || !headerItems) continue;

      const startDate = new Date(ganttInfo.start);
      const endDate = new Date(ganttInfo.end);

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

      rowsMap[ganttInfo.id] = {
        index: i,
        left: startCell * GANTT_HEADER_WIDTH + startWidth - GANTT_ROW_PADDING,
        height,
        width,
        textWidth,
      };
    }

    return rowsMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.rows, headerItems, props.ganttInfoGetter, props.ganttRowMini]);

  const getCell = React.useCallback((opts: GetCellOptions<RowData>) => {
    const ganttInfo = opts.ganttInfoGetter?.(opts.row);
    if (!ganttInfo) return null;

    const startDate = new Date(ganttInfo.start);
    const endDate = new Date(ganttInfo.end);
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const rowInfo = opts.rowsMap[ganttInfo.id];

    if (!rowInfo) return null;

    return (
      <div key={opts.row.id} className={clsx(styles.cell)} data-id="cell">
        <Tooltip
          styleBase={{
            left: rowInfo.left,
            width: "fit-content",
            position: "relative",
          }}
          classNameBaseContainer={styles.item__container}
          zIndex={10}
          text={
            opts.GanttTooltip ? (
              <opts.GanttTooltip row={opts.row} />
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
              height: rowInfo.height,
              width: rowInfo.width,
              minWidth: rowInfo.width,
              maxWidth: rowInfo.width,
            }}
          >
            {rowInfo.textWidth <= rowInfo.width && (
              <span className={styles.item__text}>{ganttInfo.name}</span>
            )}
          </div>
          {rowInfo.textWidth > rowInfo.width && (
            <span
              className={clsx(
                styles.item__text,
                !!ganttInfo.dependencies?.length && styles.item__text_shift,
              )}
            >
              {ganttInfo.name}
            </span>
          )}
        </Tooltip>
        {!!ganttInfo.dependencies?.length &&
          arrowContainerRef.current &&
          createPortal(
            <GanttArrow
              dependencies={ganttInfo.dependencies}
              rowsMap={opts.rowsMap}
              currentRowId={ganttInfo.id}
              mini={opts.mini}
              key={ganttInfo.id}
            />,
            arrowContainerRef.current,
          )}
      </div>
    );
  }, []);

  if (!headerItems || !props.ganttInfoGetter) {
    console.warn("Required ganttInfoGetter");

    return null;
  }

  return (
    <div
      data-id="table"
      ref={props.tableRef}
      className={styles.table}
      style={{
        width: props.width,
      }}
    >
      <div
        data-id="header-container"
        id={GANTT_HEADER_ID}
        className={clsx(
          styles.headerContainer,
          (props.frozenHeader || props.frozenHeader == undefined) && styles.headerContainer__frozen,
        )}
      >
        <div className={clsx(styles.header)} style={{ minHeight: 60 }} data-id="header">
          {/** HEADER ROW */}
          <div
            className={styles.headerRow}
            style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
            data-id="header-row"
          >
            {headerItems.map((item) => {
              return (
                <div
                  data-id="header-cell"
                  className={styles.headerCell}
                  key={item.year}
                  style={{
                    minWidth: GANTT_HEADER_WIDTH * item.months.length,
                    maxWidth: GANTT_HEADER_WIDTH * item.months.length,
                  }}
                >
                  {item.year}
                </div>
              );
            })}
          </div>
          {/** HEADER ROW */}
          <div
            data-id="header-row"
            className={styles.headerRow}
            style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
          >
            {headerItems.map((item) => {
              return item.months.map((month) => {
                return (
                  <div
                    data-id="header-cell"
                    className={styles.headerCell}
                    key={`${item.year}${month}`}
                    style={{ minWidth: GANTT_HEADER_WIDTH }}
                  >
                    {month}
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
      <div id={GANTT_BODY_ID} className={styles.bodyContainer} data-id="body-container">
        <div
          data-id="body"
          ref={arrowContainerRef}
          className={styles.body}
          style={{
            height: props.rowVirtualEnabled
              ? `${props.rowVirtualizer.getTotalSize()}px`
              : undefined,
            width:
              headerItems.reduce((acc, item) => {
                acc += item.months.length;

                return acc;
              }, 0) * GANTT_HEADER_WIDTH,
          }}
        >
          {/** FAKE VIRTUAL ROWS */}
          {props.rowVirtualEnabled &&
            props.rowsVirtual.map((virtualRow) => {
              return (
                <div
                  data-id="row"
                  key={virtualRow.index}
                  className={styles.fake__row}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                    minHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
                    maxHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
                  }}
                ></div>
              );
            })}
          {/** VIRTUAL ROWS */}
          {props.rowVirtualEnabled &&
            props.rowsVirtual.map((virtualRow) => {
              const row = props.rows[virtualRow.index];

              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  data-id="row"
                  key={row.id}
                  className={clsx(styles.row, styles.row__virtual)}
                  data-index={virtualRow.index}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
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
                  {getCell({
                    row,
                    ganttInfoGetter: props.ganttInfoGetter,
                    GanttTooltip: props.GanttTooltip,
                    rowsMap,
                    mini: props.ganttRowMini ?? false,
                  })}
                </div>
              );
            })}
          {/** ROWS */}
          {!props.rowVirtualEnabled &&
            props.rows.map((row) => {
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  data-id="row"
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
                  {getCell({
                    row,
                    ganttInfoGetter: props.ganttInfoGetter,
                    GanttTooltip: props.GanttTooltip,
                    rowsMap,
                    mini: props.ganttRowMini ?? false,
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
