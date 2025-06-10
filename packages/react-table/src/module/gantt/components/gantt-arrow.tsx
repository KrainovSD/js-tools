import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../../table.constants";
import type { GanttRowInfo } from "../../../types";
import { GanttArrowDown } from "./gantt-arrow-down";
import { GanttArrowUp } from "./gantt-arrow-up";
import styles from "./gantt-arrow.module.scss";

type Props = {
  currentRowId: string | number;
  dependencies: (string | number)[];
  rowsMap: Record<string | number, GanttRowInfo | undefined>;
  mini: boolean;
};

const TOP_SHIFT_MAX = -1;
const TOP_SHIFT_MINI = -2;

const DEFAULT_LINK_SIZE = 2;
const DEFAULT_CORNER_SIZE = 4;
const DEFAULT_ARROW_SIZE = 16;

const LEFT_TO_RIGHT_FIRST = 22;
const TOP_TO_BOTTOM_EXTRA_MAX = 25;
const TOP_TO_BOTTOM_EXTRA_MINI = 13;

const LEFT_TO_RIGHT_SECOND_DEFAULT = 22;

const END_ARROW_SHIFT = -8;
const TOP_ARROW_SHIFT = 1;

export function GanttArrow(props: Props) {
  const rowInfo = props.rowsMap[props.currentRowId];
  if (!rowInfo) return;

  const TOP_SHIFT = props.mini ? TOP_SHIFT_MINI : TOP_SHIFT_MAX;
  const ROW_HEIGHT = props.mini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT;
  const startTop = rowInfo.top + TOP_SHIFT;
  const startLeft = rowInfo.left + rowInfo.width - 2;

  return (
    <div className={styles.base} style={{ left: startLeft, top: startTop }}>
      {props.dependencies.map((depend, index) => {
        const dependRow = props.rowsMap[depend];
        if (!dependRow) return null;

        const indexDiff = dependRow.index - rowInfo.index;

        const fullFirstCorner =
          startLeft + LEFT_TO_RIGHT_FIRST + DEFAULT_CORNER_SIZE + LEFT_TO_RIGHT_SECOND_DEFAULT;
        const RIGHT_TO_LEFT = fullFirstCorner - dependRow.left;
        const requireExtraCorner = dependRow.left < fullFirstCorner;

        let TOP_TO_BOTTOM = Math.abs(indexDiff * ROW_HEIGHT) - DEFAULT_CORNER_SIZE * 2;
        const TOP_TO_BOTTOM_EXTRA = props.mini ? TOP_TO_BOTTOM_EXTRA_MINI : TOP_TO_BOTTOM_EXTRA_MAX;
        if (requireExtraCorner) {
          TOP_TO_BOTTOM -= TOP_TO_BOTTOM_EXTRA + DEFAULT_CORNER_SIZE * 2;
        }

        let LEFT_TO_RIGHT_SECOND =
          dependRow.left -
          startLeft -
          LEFT_TO_RIGHT_FIRST -
          DEFAULT_CORNER_SIZE * 2 +
          END_ARROW_SHIFT;
        if (requireExtraCorner) {
          LEFT_TO_RIGHT_SECOND =
            dependRow.left -
            (startLeft + LEFT_TO_RIGHT_FIRST - RIGHT_TO_LEFT - DEFAULT_CORNER_SIZE) -
            DEFAULT_CORNER_SIZE +
            END_ARROW_SHIFT;
        }

        if (indexDiff > 0) {
          return (
            <GanttArrowDown
              key={`${props.currentRowId}${depend}${index}`}
              arrowIndex={index}
              dependId={depend}
              rowId={props.currentRowId}
              arrowSize={DEFAULT_ARROW_SIZE}
              cornerSize={DEFAULT_CORNER_SIZE}
              requireExtraCorner={requireExtraCorner}
              linkSize={DEFAULT_LINK_SIZE}
              leftToRightFirst={LEFT_TO_RIGHT_FIRST}
              leftToRightSecond={LEFT_TO_RIGHT_SECOND}
              rightToLeft={RIGHT_TO_LEFT}
              topArrowShift={TOP_ARROW_SHIFT}
              topToBottom={TOP_TO_BOTTOM}
              topToBottomExtra={TOP_TO_BOTTOM_EXTRA}
            />
          );
        } else if (indexDiff < 0) {
          return (
            <GanttArrowUp
              key={`${props.currentRowId}${depend}${index}`}
              arrowIndex={index}
              dependId={depend}
              rowId={props.currentRowId}
              arrowSize={DEFAULT_ARROW_SIZE}
              cornerSize={DEFAULT_CORNER_SIZE}
              requireExtraCorner={requireExtraCorner}
              linkSize={DEFAULT_LINK_SIZE}
              leftToRightFirst={LEFT_TO_RIGHT_FIRST}
              leftToRightSecond={LEFT_TO_RIGHT_SECOND}
              rightToLeft={RIGHT_TO_LEFT}
              topArrowShift={TOP_ARROW_SHIFT}
              topToBottom={TOP_TO_BOTTOM}
              topToBottomExtra={TOP_TO_BOTTOM_EXTRA}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
