import type React from "react";
import styles from "./icon-wrapper.module.scss";

type Props = {
  padding?: number;
  paddingX?: number;
  paddingY?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function IconWrapper(props: React.PropsWithChildren<Props>) {
  const { padding = 0, paddingX = padding, paddingY = padding, ...rest } = props;

  return (
    <button className={styles.base} style={{ padding: `${paddingY}px ${paddingX}px` }} {...rest}>
      {props.children}
    </button>
  );
}
