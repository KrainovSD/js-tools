import { DatePicker as AntdDatePicker } from "antd";
import type { DatePickerProps as AntdDatePickerProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import styles from "./date-picker.module.scss";

export interface DatePickerProps extends AntdDatePickerProps {
  wide?: boolean;
}

export function DatePicker(props: DatePickerProps): JSX.Element {
  const { wide, className, ...rest } = props;

  return <AntdDatePicker {...rest} className={clsx(styles.base, wide && styles.wide, className)} />;
}
