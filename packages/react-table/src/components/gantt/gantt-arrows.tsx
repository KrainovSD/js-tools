import type { VirtualItem } from "@tanstack/react-virtual";
import React from "react";
import { createPortal } from "react-dom";
import { useArrowInfo } from "../../lib/hooks";
import type {
  DefaultGanttData,
  DefaultRow,
  GanttArrowStyleGetter,
  GanttInfo,
  GanttRowInfo,
  RowInterface,
} from "../../types";
import { GanttArrowDown } from "./gantt-arrow-down";
import { GanttArrowUp } from "./gantt-arrow-up";
import styles from "./gantt-arrows.module.scss";

type Props<RowData extends DefaultRow, GanttData extends DefaultGanttData> = {
  ganttArrowStyleGetter: GanttArrowStyleGetter<GanttData> | undefined;
  ganttInfoGetter: ((row: RowInterface<RowData>) => GanttInfo<GanttData>) | undefined;
  rowsMap: Record<string | number, GanttRowInfo | undefined>;
  rows: RowInterface<RowData>[];
  mini: boolean;
  arrowContainer: HTMLElement | null;
  bodyWidth: number | null;
  rowVirtualEnabled: boolean;
  rowsVirtual: VirtualItem[];
  ganttVisibleArrowInRange: boolean;
  ganttArrowGetAround: boolean;
};

export function GanttArrows<RowData extends DefaultRow, GanttData extends DefaultGanttData>(
  props: Props<RowData, GanttData>,
) {
  const arrows = useArrowInfo(props);

  if (!props.arrowContainer) return null;

  return createPortal(
    <React.Fragment>
      {arrows.map((arrow) => {
        return (
          <div
            key={`${arrow.rowId}${arrow.dependId}`}
            className={styles.base}
            style={{ left: arrow.startLeft, top: arrow.startTop }}
          >
            {arrow.direction === "down" && (
              <GanttArrowDown
                color={arrow.color}
                arrowIndex={arrow.index}
                dependId={arrow.dependId}
                rowId={arrow.rowId}
                arrowSize={arrow.arrowSize}
                cornerSize={arrow.cornerSize}
                requireExtraCorner={arrow.extraCorner}
                linkSize={arrow.size}
                leftToRightFirst={arrow.leftToRightFirst}
                leftToRightSecond={arrow.leftToRightSecond}
                rightToLeft={arrow.rightToLeft}
                topArrowShift={arrow.topArrowShift}
                topToBottom={arrow.topToBottom}
                topToBottomExtra={arrow.topToBottomExtra}
              />
            )}
            {arrow.direction === "up" && (
              <GanttArrowUp
                color={arrow.color}
                arrowIndex={arrow.index}
                dependId={arrow.dependId}
                rowId={arrow.rowId}
                arrowSize={arrow.arrowSize}
                cornerSize={arrow.cornerSize}
                requireExtraCorner={arrow.extraCorner}
                linkSize={arrow.size}
                leftToRightFirst={arrow.leftToRightFirst}
                leftToRightSecond={arrow.leftToRightSecond}
                rightToLeft={arrow.rightToLeft}
                topArrowShift={arrow.topArrowShift}
                topToBottom={arrow.topToBottom}
                topToBottomExtra={arrow.topToBottomExtra}
              />
            )}
          </div>
        );
      })}
    </React.Fragment>,
    props.arrowContainer,
  );
}
