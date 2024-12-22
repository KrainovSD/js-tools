import { Input as AntdInput } from "antd";
import type { InputProps as AntdInputProps, InputRef } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import React from "react";
import styles from "./input.module.scss";

export interface InputProps extends AntdInputProps {
  shape?: "square" | "circle";
}

export const Input = React.forwardRef(function Input(
  props: InputProps,
  ref: React.LegacyRef<InputRef>,
): JSX.Element {
  const { shape = "square", className, ...rest } = props;

  return <AntdInput ref={ref} {...rest} className={clsx(styles.base, styles[shape], className)} />;
});
