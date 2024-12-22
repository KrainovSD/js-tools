import { InputNumber as AntdInputNumber } from "antd";
import type { InputNumberProps as AntdInputNumberProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import styles from "./input-number.module.scss";

interface InputNumberProps extends AntdInputNumberProps {
  wide?: boolean;
}

export function InputNumber(props: InputNumberProps): JSX.Element {
  const { wide, className, ...rest } = props;

  return (
    <AntdInputNumber {...rest} className={clsx(styles.base, wide && styles.wide, className)} />
  );
}
