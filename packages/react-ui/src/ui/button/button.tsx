import { Button as AntdButton } from "antd";
import type { ButtonProps as AntdButtonProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import styles from "./button.module.scss";

export interface ButtonProps extends AntdButtonProps {
  /** Styles for icon that was been wrapped in button */
  onlyIcon?: boolean;
  fit?: boolean;
}

export function Button(props: ButtonProps): JSX.Element {
  const { onlyIcon, fit, ...rest } = props;

  return (
    <AntdButton
      {...rest}
      type={onlyIcon ? "link" : rest.type}
      className={clsx(styles.base, onlyIcon && styles.onlyIcon, fit && styles.fit, props.className)}
    />
  );
}
