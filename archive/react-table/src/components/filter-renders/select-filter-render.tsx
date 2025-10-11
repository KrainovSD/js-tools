import { Select, type SelectItemInterface } from "@krainovsd/react-ui";
import type { DefaultRow, FilterRenderProps } from "../../types";

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
