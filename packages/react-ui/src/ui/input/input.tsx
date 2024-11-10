import { Input as AntdInput } from "antd";
import type { InputProps as AntdInputProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import { styles } from "./styles";

export interface InputProps extends AntdInputProps {
  shape?: "normal" | "circle";
}

export function Input(props: InputProps): JSX.Element {
  const { shape = "normal", className, ...rest } = props;

  return (
    <AntdInput
      {...rest}
      className={clsx(styles.input, shape === "circle" && "circle", className)}
    />
  );
}
