import type { SortRenderProps } from "../../types";
import type { CommonRow } from "../types/common";

type TestProps = {
  someSortProps?: number;
  someSortTestProps?: string;
};

export function TestSortRender(props: SortRenderProps<CommonRow, TestProps>) {
  const cell = props.settings?.someSortProps;

  return <div>{cell}</div>;
}
