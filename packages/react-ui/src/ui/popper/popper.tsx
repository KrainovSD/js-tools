import type { PositionPlacements } from "@krainovsd/js-helpers";
import clsx from "clsx";
import React from "react";
import { Positioner } from "../positioner";
import styles from "./popper.module.scss";
import type { PopperSize, PopperTargetNodePosition } from "./popper.types";

type Props = {
  initialOpenState?: boolean;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;

  content: React.ReactNode;
  classBase?: string;
  classBaseContainer?: string;
  classContent?: string;
  wide?: boolean;
  full?: boolean;

  header?: string;

  // the area of the node where visibility is checked
  visibleArea?: HTMLDivElement;
  // root node for portal
  modalRoot?: string | HTMLElement;
  modalRootInner?: boolean;
  // custom initial modal position
  targetNodePosition?: PopperTargetNodePosition;
  // placement of modal from initial position
  placement?: Exclude<PositionPlacements, "flex">;
  flexPlacement?: boolean;

  // diff x position from initial
  stepX?: number;
  // diff y position from initial
  stepY?: number;
  zIndex?: number;
  isCloseByScroll?: boolean;
  isCloseByRightClick?: boolean;
  isCloseByEscape?: boolean;
  isCloseByBaseClick?: boolean;
  /**
   * The Content wrapper must have data-popper-content attribute if exist and the elements of content must have styles for selection by focus
   */
  interactiveMode?: boolean;
  openDelay?: number;
  closeDelay?: number;

  openEvent?: "click" | "hover" | "custom";
  onClose?: () => void;

  widthByParent?: boolean;

  size?: PopperSize;
  testid?: string;

  wrapperInstance?: React.MutableRefObject<HTMLDivElement | null>;

  onBaseClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export function Popper(props: React.PropsWithChildren<Props>) {
  const {
    content,
    classBase,
    classBaseContainer,
    initialOpenState = false,
    isOpen,
    setIsOpen,
    openEvent = "click",
    placement,
    size,
    testid,
    widthByParent,
    onClose,
    children,
    classContent,
    flexPlacement,
    header,
    isCloseByRightClick,
    isCloseByScroll,
    isCloseByBaseClick = true,
    isCloseByEscape,
    modalRoot,
    modalRootInner,
    stepX,
    stepY,
    targetNodePosition,
    visibleArea,
    zIndex,
    openDelay = 100,
    closeDelay = 100,
    wide,
    full,
    interactiveMode,
    wrapperInstance,
    ...rest
  } = props;

  const [localOpen, setLocalOpen] = React.useState(initialOpenState);
  const baseRef = React.useRef<HTMLDivElement | null>(null);
  const closeTimer = React.useRef<undefined | NodeJS.Timeout>(undefined);
  const openTimer = React.useRef<undefined | NodeJS.Timeout>(undefined);

  const parentWidth =
    widthByParent && baseRef.current ? baseRef.current.getBoundingClientRect().width : undefined;
  const wrapperRoot = openEvent === "hover" || modalRootInner ? baseRef.current : modalRoot;
  const isOpenPopper = typeof isOpen === "boolean" ? isOpen : localOpen;

  function onBaseClick(event: React.MouseEvent<HTMLElement>) {
    if (openEvent !== "click") return;

    if (isOpenPopper && isCloseByBaseClick) {
      setLocalOpen(false);
      setIsOpen?.(false);
    } else if (!isOpenPopper) {
      setLocalOpen(true);
      setIsOpen?.(true);
    }

    if (rest.onBaseClick) rest.onBaseClick(event);
  }

  function onPopperClose() {
    if (!isOpenPopper) return;
    onClose?.();
    setLocalOpen(false);
    setIsOpen?.(false);
  }

  /** hover effect */
  React.useEffect(() => {
    if (!baseRef.current || openEvent !== "hover") return;

    const base = baseRef.current;

    function onHover() {
      clearTimeout(closeTimer.current);
      openTimer.current = setTimeout(() => {
        setLocalOpen(true);
        setIsOpen?.(true);
      }, openDelay);
    }
    function onHoverEnd() {
      clearTimeout(openTimer.current);
      closeTimer.current = setTimeout(() => {
        setLocalOpen(false);
        setIsOpen?.(false);
      }, closeDelay);
    }

    base.addEventListener("mouseenter", onHover);
    base.addEventListener("mouseleave", onHoverEnd);

    return () => {
      if (base) {
        base.removeEventListener("mouseenter", onHover);
        base.removeEventListener("mouseleave", onHoverEnd);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={baseRef}
        className={clsx(styles.base, wide && styles.wide, full && styles.full, classBase)}
      >
        <div
          className={clsx(
            styles.container,
            wide && wide && styles.wide,
            full && styles.full,
            classBaseContainer,
          )}
          onClick={onBaseClick}
          data-test-id={testid}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.click();
          }}
          role="button"
          tabIndex={0}
        >
          {children}
        </div>
      </div>
      {isOpenPopper && baseRef.current && (
        <Positioner
          className={clsx(styles.content, size === "full" && styles.full, classContent)}
          handleClose={onPopperClose}
          targetNode={baseRef.current}
          modalRoot={wrapperRoot}
          testid={testid ? `${testid}-wrapper` : undefined}
          width={parentWidth}
          flexPlacement={flexPlacement}
          header={header}
          size={size}
          interactiveMode={interactiveMode}
          isCloseByEscape={isCloseByEscape}
          isCloseByRightClick={isCloseByRightClick}
          isCloseByScroll={isCloseByScroll}
          placement={placement}
          stepX={stepX}
          stepY={stepY}
          targetNodePosition={targetNodePosition}
          visibleArea={visibleArea}
          wrapperInstance={wrapperInstance}
          zIndex={zIndex}
        >
          {content}
        </Positioner>
      )}
    </>
  );
}
