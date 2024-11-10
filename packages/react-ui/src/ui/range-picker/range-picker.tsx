import type { GetProps } from "antd";
import { DatePicker as AntdDatePicker } from "antd";
import type { JSX } from "react";

export type RangePickerProps = GetProps<typeof AntdDatePicker.RangePicker>;

export function RangePicker(props: RangePickerProps): JSX.Element {
  return <AntdDatePicker.RangePicker {...props} />;
}
