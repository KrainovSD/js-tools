import type { FilterRenderProps } from "../../types";
import type { CommonRow } from "../types/common";

type TestProps = {
  someFilterProps?: number;
  someFilterTestProps?: string;
};

export function TestFilterRender(props: FilterRenderProps<CommonRow, TestProps>) {
  const cell = props.settings?.someFilterProps;

  return <div>{cell}</div>;
}
