import { dateFormat } from "@krainovsd/js-helpers";
import { Tooltip } from "@krainovsd/react-ui";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../table.constants";
import type {
  GanttInfo,
  GanttRowInfo,
  GanttViewType,
  RowInterface,
  TableInterface,
} from "../../types";
import { GanttArrow } from "./components";
import {
  GANTT_BODY_ID,
  GANTT_HEADER_HEIGHT,
  GANTT_HEADER_ID,
  GANTT_LEFT_SHIFT,
  GANTT_TOP_SHIFT,
} from "./gantt.constants";
import { type HeaderItem, useGanttHeader } from "./hooks";
import { getGanttColumnWidth, getGanttInitialCoordinates, getShortMonthName } from "./lib";
import styles from "./table-gantt.module.scss";

type TableContainerProps<RowData extends Record<string, unknown>> = {
  width?: number;
  tableRef?: React.LegacyRef<HTMLTableElement>;
  firstGanttDate?: string;
  lastGanttDate?: string;
  ganttRowMini?: boolean;
  ganttGrid?: boolean;
  ganttInfoGetter?: (row: RowInterface<RowData>) => GanttInfo;
  locale?: string;
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
  ganttView?: GanttViewType;
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
  let columnCount = 0;

  const GANTT_COLUMN_WIDTH = getGanttColumnWidth(props.ganttView);

  const rowsMap = React.useMemo(() => {
    const rowsMap: Record<string | number, GanttRowInfo> = {};

    for (let i = 0; i < props.rows.length; i++) {
      const row = props.rows[i];
      const ganttInfo = props.ganttInfoGetter?.(row);
      if (!ganttInfo || !headerItems) continue;

      const { left, width, height, textWidth, top } = getGanttInitialCoordinates({
        ganttInfo,
        ganttView: props.ganttView,
        index: i,
        ganttRowMini: props.ganttRowMini,
        headerItems,
      });

      rowsMap[ganttInfo.id] = {
        index: i,
        left,
        height,
        width,
        textWidth,
        top,
      };
    }

    return rowsMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.rows, headerItems, props.ganttInfoGetter, props.ganttRowMini, props.ganttView]);

  const getCell = React.useCallback((opts: GetCellOptions<RowData>) => {
    const ganttInfo = opts.ganttInfoGetter?.(opts.row);
    if (!ganttInfo) return null;

    const startDate = new Date(ganttInfo.start);
    const endDate = new Date(ganttInfo.end);
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const rowInfo = opts.rowsMap[ganttInfo.id];

    if (!rowInfo) return null;

    return (
      <React.Fragment key={ganttInfo.id}>
        <Tooltip
          styleBase={{
            left: rowInfo.left,
            top: rowInfo.top - rowInfo.height / 2 - GANTT_TOP_SHIFT,
            width: "fit-content",
            position: "absolute",
            zIndex: 4,
          }}
          classNameBaseContainer={clsx(styles.item__container)}
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
      </React.Fragment>
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
        <div
          className={clsx(styles.header)}
          style={{ minHeight: GANTT_HEADER_HEIGHT * 2 }}
          data-id="header"
        >
          {props.ganttView === "months" && (
            <GanttMonthHeader
              headerItems={headerItems}
              locale={props.locale}
              width={GANTT_COLUMN_WIDTH}
            />
          )}
          {props.ganttView === "years" && (
            <GanttYearHeader
              headerItems={headerItems}
              locale={props.locale}
              width={GANTT_COLUMN_WIDTH}
            />
          )}
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
              }, 0) * GANTT_COLUMN_WIDTH,
          }}
        >
          {/** VIRTUAL ROWS */}
          {props.rowVirtualEnabled &&
            props.rowsVirtual.map((virtualRow) => {
              const row = props.rows[virtualRow.index];

              return (
                <React.Fragment key={virtualRow.index}>
                  {getCell({
                    row,
                    ganttInfoGetter: props.ganttInfoGetter,
                    GanttTooltip: props.GanttTooltip,
                    rowsMap,
                    mini: props.ganttRowMini ?? false,
                  })}
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
                </React.Fragment>
              );
            })}

          {/** ROWS */}
          {!props.rowVirtualEnabled &&
            props.rows.map((row) => {
              return (
                <React.Fragment key={row.index}>
                  {getCell({
                    row,
                    ganttInfoGetter: props.ganttInfoGetter,
                    GanttTooltip: props.GanttTooltip,
                    rowsMap,
                    mini: props.ganttRowMini ?? false,
                  })}
                  <div
                    data-id="row"
                    className={styles.row}
                    style={{
                      minHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
                      maxHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
                    }}
                  ></div>
                </React.Fragment>
              );
            })}

          {/** FAKE VERTICAL ROWS */}
          {props.ganttGrid &&
            headerItems.map((item) => {
              return item.months.map((month) => {
                columnCount += 1;

                return (
                  <div
                    key={`${item.year}${month}`}
                    className={styles.fake__column}
                    style={{
                      left: columnCount * GANTT_COLUMN_WIDTH - GANTT_LEFT_SHIFT,
                    }}
                  ></div>
                );
              });
            })}
        </div>
      </div>
    </div>
  );
}

type GanttHeaderProps = {
  headerItems: HeaderItem[];
  width: number;
  locale: string | undefined;
};

function GanttMonthHeader(props: GanttHeaderProps) {
  return (
    <>
      {/** HEADER ROW */}
      <div
        className={styles.headerRow}
        style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
        data-id="header-row"
      >
        {props.headerItems.map((item) => {
          return (
            <div
              data-id="header-cell"
              className={styles.headerCell}
              key={item.year}
              style={{
                minWidth: props.width * item.months.length,
                maxWidth: props.width * item.months.length,
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
        {props.headerItems.map((item) => {
          return item.months.map((month) => {
            return (
              <div
                data-id="header-cell"
                className={styles.headerCell}
                key={`${item.year}${month}`}
                style={{ minWidth: props.width, maxWidth: props.width }}
              >
                {getShortMonthName(month, props.locale)}
              </div>
            );
          });
        })}
      </div>
    </>
  );
}

function GanttYearHeader(props: GanttHeaderProps) {
  const firstYear = props.headerItems[0].year;
  const lastYear = props.headerItems[props.headerItems.length - 1].year;

  return (
    <>
      {/** HEADER ROW */}
      <div
        className={styles.headerRow}
        style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
        data-id="header-row"
      >
        <div
          data-id="header-cell"
          className={styles.headerCell}
          style={{
            minWidth: props.width * props.headerItems.length,
            maxWidth: props.width * props.headerItems.length,
            justifyContent: "center",
          }}
        >
          {firstYear !== lastYear ? `${firstYear} - ${lastYear}` : firstYear}
        </div>
      </div>
      {/** HEADER ROW */}
      <div
        data-id="header-row"
        className={styles.headerRow}
        style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
      >
        {props.headerItems.map((item) => {
          return (
            <div
              data-id="header-cell"
              className={styles.headerCell}
              key={item.year}
              style={{ minWidth: props.width, maxWidth: props.width }}
            >
              {item.year}
            </div>
          );
        })}
      </div>
    </>
  );
}
