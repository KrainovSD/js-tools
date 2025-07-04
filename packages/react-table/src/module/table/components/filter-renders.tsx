import {
  DatePicker,
  DateRangePicker,
  Input,
  InputNumber,
  Select,
  type SelectItemInterface,
} from "@krainovsd/react-ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { DefaultRow } from "../../../types";

export function StringFilterRender() {
  return <Input placeholder={"Введите значение"} variant="outlined" size="middle" />;
}

export type SelectFilterRenderProps = {
  options: SelectItemInterface[];
  multiple?: boolean;
};
export function SelectFilterRender<Row extends DefaultRow>(props: ColumnDef<Row>) {
  const filterRenderProps = props.filterRenderProps as SelectFilterRenderProps | undefined;

  return (
    <Select
      mode={filterRenderProps?.multiple ? "multiple" : undefined}
      variant="outlined"
      size="middle"
      style={{ width: "fit-content", minWidth: 200, maxWidth: 600 }}
      options={filterRenderProps?.options}
      placeholder={"Выберите статус"}
    />
  );
}

export type DateFilterRenderProps = {
  format: string;
};
export function DateRangeFilterRender<Row extends DefaultRow>(props: ColumnDef<Row>) {
  const filterRenderProps = props.filterRenderProps as DateFilterRenderProps | undefined;

  return <DateRangePicker format={filterRenderProps?.format} />;
}
export function DateFilterRender<Row extends DefaultRow>(props: ColumnDef<Row>) {
  const filterRenderProps = props.filterRenderProps as DateFilterRenderProps | undefined;

  return <DatePicker format={filterRenderProps?.format} />;
}
export function NumberRangeFilterRender() {
  return <InputNumber placeholder={"Введите значение"} variant="outlined" size="middle" />;
}
export function NumberFilterRender() {
  return <InputNumber placeholder={"Введите значение"} variant="outlined" size="middle" />;
}
