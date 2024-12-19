import type { GetProps } from "antd";
import { DatePicker as AntdDatePicker } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import * as styles from "./styles";

export type DateRangePickerProps = GetProps<typeof AntdDatePicker.RangePicker> & {
  wide?: boolean;
};

export function DateRangePicker(props: DateRangePickerProps): JSX.Element {
  const { className, wide, ...rest } = props;

  return (
    <AntdDatePicker.RangePicker
      {...rest}
      className={clsx(styles.base, wide && "wide", className)}
    />
  );
}
