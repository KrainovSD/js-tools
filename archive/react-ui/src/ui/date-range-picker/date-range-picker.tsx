import { DatePicker as AntdDatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import clsx from "clsx";
import type { JSX } from "react";
import styles from "./date-range-picker.module.scss";

export interface DateRangePickerProps extends RangePickerProps {
  wide?: boolean;
}

export function DateRangePicker(props: DateRangePickerProps): JSX.Element {
  const { className, wide, ...rest } = props;

  return (
    <AntdDatePicker.RangePicker
      {...rest}
      className={clsx(styles.base, wide && styles.wide, className)}
    />
  );
}
