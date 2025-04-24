import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../table.constants";
import type {
  GanttInfo,
  GanttRowInfo,
  GanttViewType,
  RowInterface,
  TableInterface,
} from "../../types";
import {
  GanttMonthHeader,
  GanttQuarterHeader,
  GanttWeekHeader,
  GanttYearHeader,
} from "./components";
import {
  GANTT_BODY_ID,
  GANTT_HEADER_HEIGHT,
  GANTT_HEADER_ID,
  GANTT_LEFT_SHIFT,
} from "./gantt.constants";
import { useGanttColumns } from "./hooks";
import { getCell, getGanttColumnWidth, getGanttInitialCoordinates } from "./lib";
import styles from "./table-gantt.module.scss";

type TableContainerProps<
  RowData extends Record<string, unknown>,
  GanttData extends Record<string, unknown>,
> = {
  width?: number;
  tableRef?: React.LegacyRef<HTMLTableElement>;
  firstGanttDate?: string;
  lastGanttDate?: string;
  ganttRowMini?: boolean;
  ganttGrid?: boolean;
  ganttInfoGetter?: (row: RowInterface<RowData>) => GanttInfo<GanttData>;
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
  GanttTask:
    | React.FC<{
        row: RowInterface<RowData>;
        ganttInfo: GanttInfo<GanttData>;
        rowInfo: GanttRowInfo;
      }>
    | undefined;
  ganttView: GanttViewType;
};

export function TableGantt<
  RowData extends Record<string, unknown>,
  GanttData extends Record<string, unknown>,
>(props: TableContainerProps<RowData, GanttData>) {
  const arrowContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [bodyWidth, setBodyWidth] = React.useState<number | null>(null);

  const { headerItems, columnsCount } = useGanttColumns({
    rows: props.rows,
    firstGanttDate: props.firstGanttDate,
    ganttInfoGetter: props.ganttInfoGetter,
    lastGanttDate: props.lastGanttDate,
    ganttView: props.ganttView,
  });

  const GANTT_COLUMN_WIDTH = getGanttColumnWidth(props.ganttView);

  const rowsMap = React.useMemo(() => {
    const rowsMap: Record<string | number, GanttRowInfo> = {};
    if (headerItems.length === 0) return rowsMap;

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

  React.useLayoutEffect(() => {
    if (!arrowContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries[0].contentRect) return;

      setBodyWidth(entries[0].contentRect.width);
    });

    observer.observe(arrowContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!props.ganttInfoGetter) {
    throw new Error("Required ganttInfoGetter");
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
          {props.ganttView === "quarters" && (
            <GanttQuarterHeader
              headerItems={headerItems}
              locale={props.locale}
              width={GANTT_COLUMN_WIDTH}
            />
          )}
          {props.ganttView === "weeks" && (
            <GanttWeekHeader
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
            width: columnsCount * GANTT_COLUMN_WIDTH,
          }}
        >
          {/** VIRTUAL ROWS */}
          {props.rowVirtualEnabled &&
            props.rowsVirtual.map((virtualRow) => {
              const row = props.rows[virtualRow.index];

              return (
                <React.Fragment key={`${virtualRow.index}-row`}>
                  {getCell({
                    row,
                    ganttInfoGetter: props.ganttInfoGetter,
                    GanttTooltip: props.GanttTooltip,
                    rowsMap,
                    mini: props.ganttRowMini ?? false,
                    arrowContainer: arrowContainerRef.current,
                    GanttTask: props.GanttTask,
                    bodyWidth,
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
                <React.Fragment key={`${row.id}-row`}>
                  {getCell({
                    row,
                    ganttInfoGetter: props.ganttInfoGetter,
                    GanttTooltip: props.GanttTooltip,
                    rowsMap,
                    mini: props.ganttRowMini ?? false,
                    arrowContainer: arrowContainerRef.current,
                    GanttTask: props.GanttTask,
                    bodyWidth,
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
            Array.from({ length: columnsCount }, (_, index) => {
              return (
                <div
                  key={`${index}-column`}
                  className={styles.fake__column}
                  style={{
                    left: (index + 1) * GANTT_COLUMN_WIDTH - GANTT_LEFT_SHIFT,
                  }}
                ></div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
