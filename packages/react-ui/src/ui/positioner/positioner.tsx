import {
  type PositionPlacements,
  type VisiblePosition,
  getVisiblePosition,
  isString,
} from "@krainovsd/js-helpers";
import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import type { PopperSize, PopperTargetNodePosition } from "../popper";
import styles from "./positioner.module.scss";

type Props = {
  // the area of the node where visibility is checked
  visibleArea?: HTMLDivElement;
  // root node for portal
  modalRoot?: string | HTMLElement | null;
  // target node for initial modal position
  targetNode: HTMLDivElement;
  // custom initial modal position
  targetNodePosition?: PopperTargetNodePosition;
  className?: string;

  // placement of modal from initial position
  placement?: Exclude<PositionPlacements, "flex">;
  flexPlacement?: boolean;
  // diff x position from initial
  stepX?: number;
  // diff y position from initial
  stepY?: number;
  zIndex?: number;
  isCloseByScroll?: boolean;
  handleClose: () => void;
  header?: string;

  width?: number;
  isCloseByRightClick?: boolean;
  isCloseByEscape?: boolean;
  interactiveMode?: boolean;
  size?: PopperSize;
  testid?: string;

  wrapperInstance?: React.MutableRefObject<HTMLDivElement | null>;
};

export function Positioner(props: React.PropsWithChildren<Props>) {
  const {
    handleClose,
    targetNode,
    className,
    isCloseByRightClick = true,
    isCloseByEscape = true,
    header,
    isCloseByScroll = true,
    modalRoot = "#modal",
    placement = "bottom-center",
    size = "common",
    stepX,
    stepY,
    targetNodePosition,
    testid,
    visibleArea,
    width,
    flexPlacement,
    zIndex = 2,
    children,
    interactiveMode,
    wrapperInstance,
  } = props;

  const [position, setPosition] = React.useState<VisiblePosition>({
    bottom: 0,
    left: 0,
    placement: "flex",
    right: 0,
    top: 0,
  });
  const positionerRef = React.useRef<HTMLDivElement | null>(null);

  const container = isString(modalRoot)
    ? (document.querySelector(modalRoot) ?? document.body)
    : (modalRoot ?? document.body);

  const style: React.CSSProperties = {
    width: width ?? "fit-content",
    zIndex,
    top: position.top,
    left: position.left,
  };
  if (position.placement.startsWith("top")) {
    style.bottom = position.bottom;
    style.top = undefined;
  }

  /** initial position effect */
  React.useLayoutEffect(() => {
    if (!positionerRef?.current) return;

    setPosition(
      getVisiblePosition({
        node: positionerRef.current,
        initialPosition: {
          position: targetNodePosition,
          targetNode,
        },

        placement,
        flex: flexPlacement,
        stepX,
        stepY,
        visibleArea,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** close events */
  React.useEffect(() => {
    function closeByRightClick() {
      handleClose();
    }
    function closeByClick(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (positionerRef.current?.contains?.(target) || targetNode.contains(target)) return;

      handleClose();
    }
    function closeByScroll(event: Event) {
      if (!positionerRef?.current || !event.target) return;
      if (positionerRef.current.contains(event.target as Node)) return;

      handleClose();
    }
    function closeByKey(event: KeyboardEvent) {
      const arrowKeys = ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"];
      if (positionerRef.current && arrowKeys.includes(event.key)) {
        if (!interactiveMode) {
          if (!positionerRef.current || !event.target) return;
          if (positionerRef.current.contains(event.target as Node)) return;
          handleClose();
        } else {
          const root =
            positionerRef.current.querySelector(`[data-popper-content="true"]`) ??
            positionerRef.current;
          let currentElement: Element | undefined | null;
          if (
            document.activeElement &&
            Array.from(root.childNodes).some((child) => child === document.activeElement)
          )
            currentElement = document.activeElement;
          let nextElement: Element | undefined | null;

          if (!currentElement && event.key === "ArrowUp") return;
          if (!currentElement && event.key === "ArrowDown") nextElement = root.firstElementChild;
          if (currentElement && event.key === "ArrowUp")
            nextElement = currentElement.previousElementSibling;
          if (currentElement && event.key === "ArrowDown")
            nextElement = currentElement.nextElementSibling;

          if (!nextElement) return;

          (nextElement as HTMLElement).focus?.();
        }
      }

      if (event.key === "Escape" && isCloseByEscape) {
        handleClose();
        event.stopPropagation();
      }
    }

    document.addEventListener("click", closeByClick);
    if (isCloseByRightClick) document.addEventListener("contextmenu", closeByRightClick);
    if (isCloseByScroll) document.addEventListener("wheel", closeByScroll);
    document.body.addEventListener("keydown", closeByKey);
    document.addEventListener("mousedown", closeByClick);
    document.addEventListener("touchstart", closeByClick);

    return () => {
      document.removeEventListener("click", closeByClick);
      if (isCloseByRightClick) document.removeEventListener("contextmenu", closeByRightClick);
      if (isCloseByScroll) document.removeEventListener("wheel", closeByScroll);
      document.body.removeEventListener("keydown", closeByKey);
      document.removeEventListener("mousedown", closeByClick);
      document.removeEventListener("touchstart", closeByClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      data-testid={testid}
      className={clsx(styles.base, size === "full" && styles.full, className)}
      ref={(node) => {
        positionerRef.current = node;
        if (wrapperInstance != undefined) wrapperInstance.current = node;
      }}
      style={style}
    >
      {header && <div className={styles.header}>{header}</div>}
      {children}
    </div>,
    container,
  );
}
