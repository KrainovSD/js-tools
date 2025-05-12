import { dateFormat } from "@krainovsd/js-helpers";
import { Tooltip } from "@krainovsd/react-ui";
import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import { GanttArrow } from ".";
import type { GanttInfo, GanttRowInfo, RowInterface } from "../../../types";
import { GANTT_TOP_SHIFT } from "../gantt.constants";
import styles from "./table-gantt-cell.module.scss";

type GetCellOptions<
  RowData extends Record<string, unknown>,
  GanttData extends Record<string, unknown>,
> = {
  ganttInfoGetter: ((row: RowInterface<RowData>) => GanttInfo<GanttData>) | undefined;
  GanttTooltip:
    | React.FC<{
        row: RowInterface<RowData>;
      }>
    | undefined;
  GanttTask:
    | React.FC<{
        row: RowInterface<RowData>;
        ganttInfo: GanttInfo<GanttData>;
        rowInfo: GanttRowInfo;
        bodyWidth: number | null;
      }>
    | undefined;
  rowsMap: Record<string | number, GanttRowInfo | undefined>;
  row: RowInterface<RowData>;
  mini: boolean;
  arrowContainer: HTMLElement | null;
  bodyWidth: number | null;
};

export function TableGanttCell<
  RowData extends Record<string, unknown>,
  GanttData extends Record<string, unknown>,
>(opts: GetCellOptions<RowData, GanttData>) {
  const ganttInfo = opts.ganttInfoGetter?.(opts.row);
  if (!ganttInfo) return null;

  const startDate = new Date(ganttInfo.start);
  const endDate = new Date(ganttInfo.end);
  const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const rowInfo = opts.rowsMap[ganttInfo.id];
  let textMaxWidth: number | undefined;

  if (!rowInfo) return null;

  if (rowInfo.textWidth > rowInfo.width && opts.bodyWidth) {
    textMaxWidth = opts.bodyWidth - rowInfo.width - rowInfo.left - 25;
  }

  return (
    <React.Fragment key={`${ganttInfo.id}-cell`}>
      {opts.GanttTask && (
        <opts.GanttTask
          row={opts.row}
          ganttInfo={ganttInfo}
          rowInfo={rowInfo}
          bodyWidth={opts.bodyWidth}
        />
      )}
      {!opts.GanttTask && (
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
          cursorTooltip
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
              <span
                className={clsx(
                  styles.item__text,
                  styles.item__text_white,
                  styles.item__text_ellipsis,
                )}
              >
                {ganttInfo.name}
              </span>
            )}
          </div>
          {rowInfo.textWidth > rowInfo.width && (
            <span
              className={clsx(
                styles.item__text,
                styles.item__text_ellipsis,
                !!ganttInfo.dependents?.length && styles.item__text_shift,
              )}
              style={{ maxWidth: textMaxWidth }}
            >
              {ganttInfo.name}
            </span>
          )}
        </Tooltip>
      )}
      {!!ganttInfo.dependents?.length &&
        opts.arrowContainer &&
        createPortal(
          <GanttArrow
            dependencies={ganttInfo.dependents}
            rowsMap={opts.rowsMap}
            currentRowId={ganttInfo.id}
            mini={opts.mini}
            key={ganttInfo.id}
          />,
          opts.arrowContainer,
        )}
    </React.Fragment>
  );
}
