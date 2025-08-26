import { CaretRightFilled } from "@krainovsd/react-icons";
import clsx from "clsx";
import React from "react";
import styles from "./gantt-arrow-down.module.scss";

type Props = {
  color: string | undefined;
  rowId: number | string;
  dependId: number | string;
  arrowIndex: number;
  requireExtraCorner: boolean;
  leftToRightFirst: number;
  leftToRightSecond: number;
  rightToLeft: number;
  topArrowShift: number;
  topToBottom: number;
  topToBottomExtra: number;
  linkSize: number;
  cornerSize: number;
  arrowSize: number;
};

export function GanttArrowDown(props: Props) {
  return (
    <React.Fragment key={`${props.rowId}${props.dependId}${props.arrowIndex}`}>
      <div
        className={clsx(styles.link, styles.one__leftToRight)}
        style={{
          width: props.leftToRightFirst,
          height: props.linkSize,
          left: 0,
          top: 0,
          ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
        }}
      ></div>
      <div
        className={clsx(styles.corner, styles.one__radius)}
        style={{
          left: props.leftToRightFirst,
          top: 0,
          ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
        }}
      ></div>
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.two__topToBottom)}
          style={{
            width: props.linkSize,
            height: props.topToBottomExtra,
            left: props.leftToRightFirst + props.cornerSize,
            top: props.cornerSize,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.corner, styles.two__radius)}
          style={{
            left: props.leftToRightFirst,
            top: props.topToBottomExtra + props.cornerSize,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.three__rightToLeft)}
          style={{
            width: props.rightToLeft,
            height: props.linkSize,
            left: props.leftToRightFirst - props.rightToLeft,
            top: props.topToBottomExtra + props.cornerSize * 2,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.corner, styles.three__radius)}
          style={{
            left: props.leftToRightFirst - props.rightToLeft - props.cornerSize,
            top: props.topToBottomExtra + props.cornerSize * 2,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.four__topToBottom)}
          style={{
            width: props.linkSize,
            height: props.topToBottom,
            left: props.leftToRightFirst - props.rightToLeft - props.cornerSize,
            top: props.topToBottomExtra + props.cornerSize * 3,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
        ></div>
      )}
      {!props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.four__topToBottom)}
          style={{
            width: props.linkSize,
            height: props.topToBottom,
            left: props.leftToRightFirst + props.cornerSize,
            top: props.cornerSize,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.corner, styles.four__radius)}
          style={{
            left: props.leftToRightFirst - props.rightToLeft - props.cornerSize,
            top: props.topToBottomExtra + props.topToBottom + props.cornerSize * 3,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
        ></div>
      )}
      {!props.requireExtraCorner && (
        <div
          className={clsx(styles.corner, styles.four__radius)}
          style={{
            left: props.leftToRightFirst + props.cornerSize,
            top: props.topToBottom + props.cornerSize,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.five__leftToRight)}
          style={{
            width: props.leftToRightSecond,
            height: props.linkSize,
            left: props.leftToRightFirst - props.rightToLeft,
            top: props.topToBottomExtra + props.topToBottom + props.cornerSize * 4,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
        ></div>
      )}
      {!props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.five__leftToRight)}
          style={{
            width: props.leftToRightSecond,
            height: props.linkSize,
            left: props.leftToRightFirst + props.cornerSize * 2,
            top: props.topToBottom + props.cornerSize * 2,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <CaretRightFilled
          className={styles.arrow}
          color="inherit"
          style={{
            left:
              props.leftToRightFirst -
              props.rightToLeft +
              props.leftToRightSecond -
              props.arrowSize / 2,
            top:
              props.topToBottomExtra +
              props.topToBottom +
              props.cornerSize * 4 -
              props.arrowSize / 2 +
              props.topArrowShift,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
          size={props.arrowSize}
        />
      )}
      {!props.requireExtraCorner && (
        <CaretRightFilled
          className={styles.arrow}
          color="inherit"
          style={{
            left:
              props.leftToRightFirst +
              props.cornerSize * 2 +
              props.leftToRightSecond -
              props.arrowSize / 2,
            top:
              props.topToBottom + props.cornerSize * 2 - props.arrowSize / 2 + props.topArrowShift,
            ...({ "--size": props.linkSize, "--color": props.color } as React.CSSProperties),
          }}
          size={props.arrowSize}
        />
      )}
    </React.Fragment>
  );
}
