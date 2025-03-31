import type { PositionPlacements } from "@krainovsd/js-helpers";
import clsx from "clsx";
import type { ReactNode } from "react";
import type React from "react";
import { Flex } from "../flex";
import { Popper } from "../popper";
import styles from "./tooltip.module.scss";

export type TooltipProps = {
  classNameBase?: string;
  classNameBaseContainer?: string;
  classNameContentContainer?: string;
  classNameContent?: string;
  text: string;
  render?: (text: string) => ReactNode;
  closeDelay?: number;
  openDelay?: number;
  modalRoot?: string | HTMLElement | undefined;
  modalRootInner?: boolean;
  placement?: Exclude<PositionPlacements, "flex">;
};

export function Tooltip(props: React.PropsWithChildren<TooltipProps>): React.JSX.Element {
  return (
    <Popper
      classContent={clsx(styles.popper__content, props.classNameContentContainer)}
      classBase={clsx(props.classNameBase)}
      classBaseContainer={clsx(props.classNameBaseContainer)}
      content={
        props.render?.(props.text) ?? (
          <Flex className={clsx(styles.content, props.classNameContent)}>{props.text}</Flex>
        )
      }
      closeDelay={props.closeDelay}
      openDelay={props.openDelay}
      modalRoot={props.modalRoot}
      modalRootInner={props.modalRootInner}
      openEvent="tooltip"
      arrow
      placement={props.placement}
    >
      {props.children}
    </Popper>
  );
}
