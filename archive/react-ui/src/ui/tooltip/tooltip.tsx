import type { PositionPlacements } from "@krainovsd/js-helpers";
import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import type React from "react";
import { Flex } from "../flex";
import { Popper } from "../popper";
import styles from "./tooltip.module.scss";

export type TooltipProps = {
  classNameBase?: string;
  classNameBaseContainer?: string;
  classNameContentContainer?: string;
  classNameContent?: string;
  styleBase?: CSSProperties;
  styleBaseContainer?: CSSProperties;
  styleContent?: CSSProperties;
  styleContentContainer?: CSSProperties;
  text: string | ReactNode;
  render?: () => ReactNode;
  closeDelay?: number;
  openDelay?: number;
  modalRoot?: string | HTMLElement | undefined;
  modalRootInner?: boolean;
  placement?: Exclude<PositionPlacements, "flex">;
  autoTooltip?: boolean;
  cursorTooltip?: boolean;
  zIndex?: number;
};

export function Tooltip(props: React.PropsWithChildren<TooltipProps>): React.JSX.Element {
  return (
    <Popper
      classContent={clsx(styles.popper__content, props.classNameContentContainer)}
      classBase={clsx(styles.popper__base, props.classNameBase)}
      classBaseContainer={clsx(styles.popper__container, props.classNameBaseContainer)}
      content={
        props.render?.() ?? (
          <Flex className={clsx(styles.content, props.classNameContent)} style={props.styleContent}>
            {props.text}
          </Flex>
        )
      }
      styleBase={props.styleBase}
      styleBaseContainer={props.styleBaseContainer}
      styleContent={props.styleContentContainer}
      closeDelay={props.closeDelay}
      openDelay={props.openDelay}
      modalRoot={props.modalRoot}
      modalRootInner={props.modalRootInner}
      openEvent="tooltip"
      arrow
      autoTooltip={props.autoTooltip}
      cursorTooltip={props.cursorTooltip}
      placement={props.placement}
      zIndex={props.zIndex}
    >
      {props.children}
    </Popper>
  );
}
