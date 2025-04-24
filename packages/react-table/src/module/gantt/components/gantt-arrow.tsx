import { CaretRightFilled } from "@krainovsd/react-icons";
import clsx from "clsx";
import React from "react";
import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../../table.constants";
import type { GanttRowInfo } from "../../../types";
import styles from "./gantt-arrow.module.scss";

type Props = {
  currentRowId: string | number;
  dependencies: (string | number)[];
  rowsMap: Record<string | number, GanttRowInfo | undefined>;
  mini: boolean;
};

const DEFAULT_LINK_SIZE = 2;
const DEFAULT_CORNER_SIZE = 4;
const DEFAULT_ARROW_SIZE = 16;

const LEFT_TO_RIGHT_FIRST = 22;
const TOP_TO_BOTTOM_EXTRA_MAX = 25;
const TOP_TO_BOTTOM_EXTRA_MINI = 13;

const LEFT_TO_RIGHT_SECOND_DEFAULT = 22;

const TOP_SHIFT_MAX = -1;
const TOP_SHIFT_MINI = -2;
const END_ARROW_SHIFT = -8;
const TOP_ARROW_SHIFT = 1;

export function GanttArrow(props: Props) {
  const rowInfo = props.rowsMap[props.currentRowId];
  if (!rowInfo) return;

  const TOP_SHIFT = props.mini ? TOP_SHIFT_MINI : TOP_SHIFT_MAX;
  const startTop = rowInfo.top + TOP_SHIFT;
  const startLeft = rowInfo.left + rowInfo.width - 2;

  return (
    <div className={styles.base} style={{ left: startLeft, top: startTop }}>
      {props.dependencies.map((depend) => {
        const dependRow = props.rowsMap[depend];

        if (!dependRow) return null;

        const dependLeft = dependRow.left;
        const fullFirstCorner =
          startLeft + LEFT_TO_RIGHT_FIRST + DEFAULT_CORNER_SIZE + LEFT_TO_RIGHT_SECOND_DEFAULT;
        const RIGHT_TO_LEFT = fullFirstCorner - dependLeft;
        const requireExtraCorner = dependLeft < fullFirstCorner;

        const indexDiff = dependRow.index - rowInfo.index;
        let TOP_TO_BOTTOM =
          indexDiff * (props.mini ? GANTT_ROW_HEIGHT_MINI : GANTT_ROW_HEIGHT) -
          DEFAULT_CORNER_SIZE * 2;
        const TOP_TO_BOTTOM_EXTRA = props.mini ? TOP_TO_BOTTOM_EXTRA_MINI : TOP_TO_BOTTOM_EXTRA_MAX;
        if (requireExtraCorner) TOP_TO_BOTTOM -= TOP_TO_BOTTOM_EXTRA + DEFAULT_CORNER_SIZE * 2;

        let LEFT_TO_RIGHT_SECOND =
          dependLeft - startLeft - LEFT_TO_RIGHT_FIRST - DEFAULT_CORNER_SIZE * 2 + END_ARROW_SHIFT;
        if (requireExtraCorner) {
          LEFT_TO_RIGHT_SECOND =
            dependLeft -
            (startLeft + LEFT_TO_RIGHT_FIRST - RIGHT_TO_LEFT - DEFAULT_CORNER_SIZE) -
            DEFAULT_CORNER_SIZE +
            END_ARROW_SHIFT;
        }

        if (indexDiff <= 0) return null;

        return (
          <React.Fragment key={`${props.currentRowId}${depend}`}>
            <div
              className={clsx(styles.link, styles.one__leftToRight)}
              style={{ width: LEFT_TO_RIGHT_FIRST, height: DEFAULT_LINK_SIZE, left: 0, top: 0 }}
            ></div>
            <div
              className={clsx(styles.corner, styles.one__radius)}
              style={{ left: LEFT_TO_RIGHT_FIRST, top: 0 }}
            ></div>
            {requireExtraCorner && (
              <div
                className={clsx(styles.link, styles.two__topToBottom)}
                style={{
                  width: DEFAULT_LINK_SIZE,
                  height: TOP_TO_BOTTOM_EXTRA,
                  left: LEFT_TO_RIGHT_FIRST + DEFAULT_CORNER_SIZE,
                  top: DEFAULT_CORNER_SIZE,
                }}
              ></div>
            )}
            {requireExtraCorner && (
              <div
                className={clsx(styles.corner, styles.two__radius)}
                style={{
                  left: LEFT_TO_RIGHT_FIRST,
                  top: TOP_TO_BOTTOM_EXTRA + DEFAULT_CORNER_SIZE,
                }}
              ></div>
            )}
            {requireExtraCorner && (
              <div
                className={clsx(styles.link, styles.three__rightToLeft)}
                style={{
                  width: RIGHT_TO_LEFT,
                  height: DEFAULT_LINK_SIZE,
                  left: LEFT_TO_RIGHT_FIRST - RIGHT_TO_LEFT,
                  top: TOP_TO_BOTTOM_EXTRA + DEFAULT_CORNER_SIZE * 2,
                }}
              ></div>
            )}
            {requireExtraCorner && (
              <div
                className={clsx(styles.corner, styles.three__radius)}
                style={{
                  left: LEFT_TO_RIGHT_FIRST - RIGHT_TO_LEFT - DEFAULT_CORNER_SIZE,
                  top: TOP_TO_BOTTOM_EXTRA + DEFAULT_CORNER_SIZE * 2,
                }}
              ></div>
            )}
            {requireExtraCorner && (
              <div
                className={clsx(styles.link, styles.four__topToBottom)}
                style={{
                  width: DEFAULT_LINK_SIZE,
                  height: TOP_TO_BOTTOM,
                  left: LEFT_TO_RIGHT_FIRST - RIGHT_TO_LEFT - DEFAULT_CORNER_SIZE,
                  top: TOP_TO_BOTTOM_EXTRA + DEFAULT_CORNER_SIZE * 3,
                }}
              ></div>
            )}
            {!requireExtraCorner && (
              <div
                className={clsx(styles.link, styles.four__topToBottom)}
                style={{
                  width: DEFAULT_LINK_SIZE,
                  height: TOP_TO_BOTTOM,
                  left: LEFT_TO_RIGHT_FIRST + DEFAULT_CORNER_SIZE,
                  top: DEFAULT_CORNER_SIZE,
                }}
              ></div>
            )}
            {requireExtraCorner && (
              <div
                className={clsx(styles.corner, styles.four__radius)}
                style={{
                  left: LEFT_TO_RIGHT_FIRST - RIGHT_TO_LEFT - DEFAULT_CORNER_SIZE,
                  top: TOP_TO_BOTTOM_EXTRA + TOP_TO_BOTTOM + DEFAULT_CORNER_SIZE * 3,
                }}
              ></div>
            )}
            {!requireExtraCorner && (
              <div
                className={clsx(styles.corner, styles.four__radius)}
                style={{
                  left: LEFT_TO_RIGHT_FIRST + DEFAULT_CORNER_SIZE,
                  top: TOP_TO_BOTTOM + DEFAULT_CORNER_SIZE,
                }}
              ></div>
            )}
            {requireExtraCorner && (
              <div
                className={clsx(styles.link, styles.five__leftToRight)}
                style={{
                  width: LEFT_TO_RIGHT_SECOND,
                  height: DEFAULT_LINK_SIZE,
                  left: LEFT_TO_RIGHT_FIRST - RIGHT_TO_LEFT,
                  top: TOP_TO_BOTTOM_EXTRA + TOP_TO_BOTTOM + DEFAULT_CORNER_SIZE * 4,
                }}
              ></div>
            )}
            {!requireExtraCorner && (
              <div
                className={clsx(styles.link, styles.five__leftToRight)}
                style={{
                  width: LEFT_TO_RIGHT_SECOND,
                  height: DEFAULT_LINK_SIZE,
                  left: LEFT_TO_RIGHT_FIRST + DEFAULT_CORNER_SIZE * 2,
                  top: TOP_TO_BOTTOM + DEFAULT_CORNER_SIZE * 2,
                }}
              ></div>
            )}
            {requireExtraCorner && (
              <CaretRightFilled
                className={styles.arrow}
                color="inherit"
                style={{
                  left:
                    LEFT_TO_RIGHT_FIRST -
                    RIGHT_TO_LEFT +
                    LEFT_TO_RIGHT_SECOND -
                    DEFAULT_ARROW_SIZE / 2,
                  top:
                    TOP_TO_BOTTOM_EXTRA +
                    TOP_TO_BOTTOM +
                    DEFAULT_CORNER_SIZE * 4 -
                    DEFAULT_ARROW_SIZE / 2 +
                    TOP_ARROW_SHIFT,
                }}
                size={DEFAULT_ARROW_SIZE}
              />
            )}
            {!requireExtraCorner && (
              <CaretRightFilled
                className={styles.arrow}
                color="inherit"
                style={{
                  left:
                    LEFT_TO_RIGHT_FIRST +
                    DEFAULT_CORNER_SIZE * 2 +
                    LEFT_TO_RIGHT_SECOND -
                    DEFAULT_ARROW_SIZE / 2,
                  top:
                    TOP_TO_BOTTOM +
                    DEFAULT_CORNER_SIZE * 2 -
                    DEFAULT_ARROW_SIZE / 2 +
                    TOP_ARROW_SHIFT,
                }}
                size={DEFAULT_ARROW_SIZE}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
