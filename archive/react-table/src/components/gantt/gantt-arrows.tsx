import type { VirtualItem } from "@tanstack/react-virtual";
import clsx from "clsx";
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

const FIND_ARROW_RADIUS = 4;

export function GanttArrows<RowData extends DefaultRow, GanttData extends DefaultGanttData>(
  props: Props<RowData, GanttData>,
) {
  const arrows = useArrowInfo(props);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!props.arrowContainer) return;
    const container = props.arrowContainer;

    function checkClickToArrow(event: MouseEvent) {
      let closestElement: HTMLElement | null = null;
      let closestDistance: number = Infinity;
      for (let x = -FIND_ARROW_RADIUS; x <= FIND_ARROW_RADIUS; x++) {
        for (let y = -FIND_ARROW_RADIUS; y <= FIND_ARROW_RADIUS; y++) {
          const shiftedX = event.clientX + x;
          const shiftedY = event.clientY + y;

          const elements = document.elementsFromPoint(shiftedX, shiftedY);
          const element = elements.find(
            (element) => element.closest(".gantt-arrow") && element.hasAttribute("data-id"),
          );
          if (element) {
            const dx = shiftedX - event.clientX;
            const dy = shiftedY - event.clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestElement = element as HTMLElement;
            }
          }
        }
      }

      const id = closestElement?.getAttribute?.("data-id");
      setSelectedId(id ?? null);
    }

    container.addEventListener("click", checkClickToArrow);

    return () => {
      container.removeEventListener("click", checkClickToArrow);
    };
  }, [props.arrowContainer]);

  if (!props.arrowContainer) return null;

  return createPortal(
    <React.Fragment>
      {arrows.map((arrow) => {
        return (
          <div
            key={arrow.linkId}
            className={clsx(styles.base, "gantt-arrow")}
            style={{
              left: arrow.startLeft,
              top: arrow.startTop,
              zIndex: selectedId === arrow.linkId ? 4 : 3,
              ...({
                "--size":
                  selectedId === arrow.linkId ? "var(--table-selected-arrow-size)" : arrow.size,
                "--color":
                  selectedId === arrow.linkId ? "var(--table-selected-arrow-color)" : arrow.color,
              } as React.CSSProperties),
            }}
          >
            {arrow.direction === "down" && (
              <GanttArrowDown
                linkId={arrow.linkId}
                linkSize={selectedId === arrow.linkId ? 2 : arrow.size}
                arrowSize={arrow.arrowSize}
                cornerSize={arrow.cornerSize}
                requireExtraCorner={arrow.extraCorner}
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
                linkId={arrow.linkId}
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
