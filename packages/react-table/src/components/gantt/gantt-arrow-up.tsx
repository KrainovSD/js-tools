import { CaretRightFilled } from "@krainovsd/react-icons";
import clsx from "clsx";
import React from "react";
import styles from "./gantt-arrow-up.module.scss";

type Props = {
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
  linkId: string;
};

export function GanttArrowUp(props: Props) {
  return (
    <React.Fragment key={`${props.rowId}${props.dependId}${props.arrowIndex}`}>
      <div
        className={clsx(styles.link, styles.one__leftToRight)}
        data-id={props.linkId}
        style={{
          width: props.leftToRightFirst,
          height: props.linkSize,
          left: 0,
          top: 0,
        }}
      ></div>
      <div
        className={clsx(styles.corner, styles.one__radius)}
        data-id={props.linkId}
        style={{
          left: props.leftToRightFirst,
          top: -props.cornerSize,
        }}
      ></div>
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.two__topToBottom)}
          data-id={props.linkId}
          style={{
            width: props.linkSize,
            height: props.topToBottomExtra,
            left: props.leftToRightFirst + props.cornerSize,
            top: -props.cornerSize - props.topToBottomExtra,
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.corner, styles.two__radius)}
          data-id={props.linkId}
          style={{
            left: props.leftToRightFirst,
            top: -(props.cornerSize * 2) - props.topToBottomExtra,
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.three__rightToLeft)}
          data-id={props.linkId}
          style={{
            width: props.rightToLeft,
            height: props.linkSize,
            left: props.leftToRightFirst - props.rightToLeft,
            top: -(props.cornerSize * 2) - props.topToBottomExtra,
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.corner, styles.three__radius)}
          data-id={props.linkId}
          style={{
            left: props.leftToRightFirst - props.rightToLeft - props.cornerSize,
            top: -(props.cornerSize * 3) - props.topToBottomExtra,
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.four__topToBottom)}
          data-id={props.linkId}
          style={{
            width: props.linkSize,
            height: props.topToBottom,
            left: props.leftToRightFirst - props.rightToLeft - props.cornerSize,
            top: -(props.cornerSize * 3) - props.topToBottomExtra - props.topToBottom,
          }}
        ></div>
      )}
      {!props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.four__topToBottom)}
          data-id={props.linkId}
          style={{
            width: props.linkSize,
            height: props.topToBottom,
            left: props.leftToRightFirst + props.cornerSize,
            top: -props.cornerSize - props.topToBottom,
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.corner, styles.four__radius)}
          data-id={props.linkId}
          style={{
            left: props.leftToRightFirst - props.rightToLeft - props.cornerSize,
            top: -(props.cornerSize * 4) - props.topToBottomExtra - props.topToBottom,
          }}
        ></div>
      )}
      {!props.requireExtraCorner && (
        <div
          className={clsx(styles.corner, styles.four__radius)}
          data-id={props.linkId}
          style={{
            left: props.leftToRightFirst + props.cornerSize,
            top: -(props.cornerSize * 2) - props.topToBottom,
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.five__leftToRight)}
          data-id={props.linkId}
          style={{
            width: props.leftToRightSecond,
            height: props.linkSize,
            left: props.leftToRightFirst - props.rightToLeft,
            top: -(props.cornerSize * 4) - props.topToBottomExtra - props.topToBottom,
          }}
        ></div>
      )}
      {!props.requireExtraCorner && (
        <div
          className={clsx(styles.link, styles.five__leftToRight)}
          data-id={props.linkId}
          style={{
            width: props.leftToRightSecond,
            height: props.linkSize,
            left: props.leftToRightFirst + props.cornerSize * 2,
            top: -(props.cornerSize * 2) - props.topToBottom,
          }}
        ></div>
      )}
      {props.requireExtraCorner && (
        <CaretRightFilled
          className={styles.arrow}
          data-id={props.linkId}
          color="inherit"
          style={{
            left:
              props.leftToRightFirst -
              props.rightToLeft +
              props.leftToRightSecond -
              props.arrowSize / 2,
            top:
              -(props.cornerSize * 4) -
              props.topToBottomExtra -
              props.topToBottom -
              props.arrowSize / 2 +
              props.topArrowShift,
          }}
          size={props.arrowSize}
        />
      )}
      {!props.requireExtraCorner && (
        <CaretRightFilled
          className={styles.arrow}
          data-id={props.linkId}
          color="inherit"
          style={{
            left:
              props.leftToRightFirst +
              props.cornerSize * 2 +
              props.leftToRightSecond -
              props.arrowSize / 2,
            top:
              -(props.cornerSize * 2) -
              props.topToBottom -
              props.arrowSize / 2 +
              props.topArrowShift,
          }}
          size={props.arrowSize}
        />
      )}
    </React.Fragment>
  );
}
