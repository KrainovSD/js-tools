import clsx from "clsx";
import React from "react";
import { GanttMonthHeader, GanttQuarterHeader, GanttWeekHeader, GanttYearHeader } from ".";
import type { GanttViewType } from "../../../types";
import { GANTT_HEADER_HEIGHT, GANTT_HEADER_ID } from "../gantt.constants";
import type { HeaderItem } from "../hooks";
import styles from "./table-gantt-header-row.module.scss";

type Props = {
  headerItems: HeaderItem[];
  locale: string | undefined;
  columnWidth: number;
  ganttView: GanttViewType;
  frozenHeader: boolean | undefined;
};

export const TableGanttHeaderRow = React.memo(function TableGanttHeaderRow(props: Props) {
  return (
    <div
      data-id="header-container"
      id={GANTT_HEADER_ID}
      className={clsx(
        styles.headerContainer,
        (props.frozenHeader || props.frozenHeader == undefined) && styles.headerContainer__frozen,
        "ksd-gantt-header-container",
      )}
    >
      <div
        className={clsx(styles.header, "ksd-gantt-header")}
        style={{ minHeight: GANTT_HEADER_HEIGHT * 2 }}
        data-id="header"
      >
        {props.ganttView === "months" && (
          <GanttMonthHeader
            headerItems={props.headerItems}
            locale={props.locale}
            width={props.columnWidth}
          />
        )}
        {props.ganttView === "years" && (
          <GanttYearHeader
            headerItems={props.headerItems}
            locale={props.locale}
            width={props.columnWidth}
          />
        )}
        {props.ganttView === "quarters" && (
          <GanttQuarterHeader
            headerItems={props.headerItems}
            locale={props.locale}
            width={props.columnWidth}
          />
        )}
        {props.ganttView === "weeks" && (
          <GanttWeekHeader
            headerItems={props.headerItems}
            locale={props.locale}
            width={props.columnWidth}
          />
        )}
      </div>
    </div>
  );
}) as (props: Props) => React.JSX.Element;
