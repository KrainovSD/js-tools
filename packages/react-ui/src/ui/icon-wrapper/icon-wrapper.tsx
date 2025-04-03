import clsx from "clsx";
import type React from "react";
import styles from "./icon-wrapper.module.scss";

type Props = {
  padding?: number;
  paddingX?: number;
  paddingY?: number;
  className?: string;
  style?: React.CSSProperties;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function IconWrapper(props: React.PropsWithChildren<Props>) {
  const { padding = 0, paddingX = padding, paddingY = padding, className, style, ...rest } = props;

  return (
    <button
      className={clsx(styles.base, className)}
      style={{ ...style, padding: `${paddingY}px ${paddingX}px` }}
      {...rest}
    >
      {props.children}
    </button>
  );
}
