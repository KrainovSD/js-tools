import { DateRangePicker } from "@krainovsd/react-ui";
import type { DefaultRow, FilterRenderProps } from "../../types";

export type DateRangeFilterRenderProps = {
  format: string;
};
export function DateRangeFilterRender<Row extends DefaultRow>(
  props: FilterRenderProps<Row, DateRangeFilterRenderProps>,
) {
  return <DateRangePicker format={props.settings?.format} />;
}
