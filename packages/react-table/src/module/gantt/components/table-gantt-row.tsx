import clsx from "clsx";
import React from "react";
import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../../table.constants";
import type { GanttInfo, GanttRowInfo, RowInterface } from "../../../types";
import { TableGanttCell } from "./table-gantt-cell";
import styles from "./table-gantt-row.module.scss";

type Props<RowData extends Record<string, unknown>, GanttData extends Record<string, unknown>> = {
  GanttTooltip?: React.FC<{ row: RowInterface<RowData> }>;
  GanttTask:
    | React.FC<{
        row: RowInterface<RowData>;
        ganttInfo: GanttInfo<GanttData>;
        rowInfo: GanttRowInfo;
        bodyWidth: number | null;
      }>
    | undefined;
  rowsMap: Record<string | number, GanttRowInfo | undefined>;
  bodyWidth: number | null;
  ganttInfoGetter?: (row: RowInterface<RowData>) => GanttInfo<GanttData>;
  arrowContainer: HTMLElement | null;
  ganttRowMini: boolean | undefined;
  row: RowInterface<RowData>;
  virtualStart: number | undefined;
};

export const TableGanttRow = React.memo(function TableGanttRow<
  RowData extends Record<string, unknown>,
  GanttData extends Record<string, unknown>,
>(props: Props<RowData, GanttData>) {
  return (
    <>
      <TableGanttCell
        GanttTask={props.GanttTask}
        GanttTooltip={props.GanttTooltip}
        arrowContainer={props.arrowContainer}
        bodyWidth={props.bodyWidth}
        ganttInfoGetter={props.ganttInfoGetter}
        mini={props.ganttRowMini ?? false}
        row={props.row}
        rowsMap={props.rowsMap}
      />
      <div
        data-id="row"
        className={clsx(
          props.virtualStart == undefined && styles.row,
          props.virtualStart != undefined && styles.fake__row,
        )}
        style={{
          transform:
            props.virtualStart != undefined ? `translateY(${props.virtualStart}px)` : undefined,
          minHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
          maxHeight: props.ganttRowMini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT,
        }}
      ></div>
    </>
  );
}) as <RowData extends Record<string, unknown>, GanttData extends Record<string, unknown>>(
  props: Props<RowData, GanttData>,
) => React.JSX.Element;
