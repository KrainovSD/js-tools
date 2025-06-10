import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import React from "react";
import type {
  GanttInfo,
  GanttRowInfo,
  GanttTaskProps,
  GanttTooltipProps,
  GanttViewType,
  RowInterface,
  TableInterface,
} from "../../types";
import { TableGanttRow } from "./components";
import { TableGanttHeaderRow } from "./components/table-gantt-header-row";
import { GANTT_BODY_ID, GANTT_LEFT_SHIFT } from "./gantt.constants";
import { useGanttColumns } from "./hooks";
import { getGanttColumnWidth, getGanttInitialCoordinates } from "./lib";
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
  GanttTooltip: React.FC<GanttTooltipProps<RowData>> | undefined;
  GanttTask: React.FC<GanttTaskProps<RowData, GanttData>> | undefined;
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
    const rowsMap: Record<string | number, GanttRowInfo | undefined> = {};
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
      <TableGanttHeaderRow
        columnWidth={GANTT_COLUMN_WIDTH}
        ganttView={props.ganttView}
        headerItems={headerItems}
        locale={props.locale}
        frozenHeader={props.frozenHeader}
      />
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
                <TableGanttRow
                  GanttTask={props.GanttTask}
                  GanttTooltip={props.GanttTooltip}
                  arrowContainer={arrowContainerRef.current}
                  bodyWidth={bodyWidth}
                  ganttInfoGetter={props.ganttInfoGetter}
                  row={row}
                  rowsMap={rowsMap}
                  key={`${row.id}-row`}
                  ganttRowMini={props.ganttRowMini}
                  virtualStart={virtualRow.start}
                />
              );
            })}

          {/** ROWS */}
          {!props.rowVirtualEnabled &&
            props.rows.map((row) => {
              return (
                <TableGanttRow
                  GanttTask={props.GanttTask}
                  GanttTooltip={props.GanttTooltip}
                  arrowContainer={arrowContainerRef.current}
                  bodyWidth={bodyWidth}
                  ganttInfoGetter={props.ganttInfoGetter}
                  row={row}
                  rowsMap={rowsMap}
                  key={`${row.id}-row`}
                  ganttRowMini={props.ganttRowMini}
                  virtualStart={undefined}
                />
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
