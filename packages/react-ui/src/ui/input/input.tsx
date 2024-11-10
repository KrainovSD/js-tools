import { Input as AntdInput } from "antd";
import type { InputProps as AntdInputProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import * as styles from "./styles";

export interface InputProps extends AntdInputProps {
  shape?: "square" | "circle";
}

export function Input(props: InputProps): JSX.Element {
  const { shape = "square", className, ...rest } = props;

  return <AntdInput {...rest} className={clsx(styles.base, shape, className)} />;
}
