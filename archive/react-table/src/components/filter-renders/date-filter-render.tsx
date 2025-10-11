import { DatePicker } from "antd";
import type { DefaultRow, FilterRenderProps } from "../../types";

export type DateFilterRenderProps = {
  format: string;
};
export function DateFilterRender<Row extends DefaultRow>(
  props: FilterRenderProps<Row, DateFilterRenderProps>,
) {
  return <DatePicker format={props.settings?.format} />;
}
