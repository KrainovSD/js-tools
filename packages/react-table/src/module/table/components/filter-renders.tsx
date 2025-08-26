import {
  DatePicker,
  DateRangePicker,
  Input,
  InputNumber,
  Select,
  type SelectItemInterface,
} from "@krainovsd/react-ui";
import type { DefaultRow, FilterRenderProps } from "../../../types";

export function StringFilterRender() {
  return <Input placeholder={"Введите значение"} variant="outlined" size="middle" />;
}

export type SelectFilterRenderProps = {
  options: SelectItemInterface[];
  multiple?: boolean;
};
export function SelectFilterRender<Row extends DefaultRow>(
  props: FilterRenderProps<Row, SelectFilterRenderProps>,
) {
  return (
    <Select
      mode={props.settings?.multiple ? "multiple" : undefined}
      variant="outlined"
      size="middle"
      style={{ width: "fit-content", minWidth: 200, maxWidth: 600 }}
      options={props.settings?.options}
      placeholder={"Выберите статус"}
    />
  );
}

export type DateFilterRenderProps = {
  format: string;
};
export function DateRangeFilterRender<Row extends DefaultRow>(
  props: FilterRenderProps<Row, DateFilterRenderProps>,
) {
  return <DateRangePicker format={props.settings?.format} />;
}
export function DateFilterRender<Row extends DefaultRow>(
  props: FilterRenderProps<Row, DateFilterRenderProps>,
) {
  return <DatePicker format={props.settings?.format} />;
}
export function NumberRangeFilterRender() {
  return <InputNumber placeholder={"Введите значение"} variant="outlined" size="middle" />;
}
export function NumberFilterRender() {
  return <InputNumber placeholder={"Введите значение"} variant="outlined" size="middle" />;
}
