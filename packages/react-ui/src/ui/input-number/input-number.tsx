import { InputNumber as AntdInputNumber } from "antd";
import type { InputNumberProps as AntdInputNumberProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import * as styles from "./styles";

interface InputNumberProps extends AntdInputNumberProps {
  wide?: boolean;
}

export function InputNumber(props: InputNumberProps): JSX.Element {
  const { wide, className, ...rest } = props;

  return <AntdInputNumber {...rest} className={clsx(styles.base, wide && "wide", className)} />;
}
