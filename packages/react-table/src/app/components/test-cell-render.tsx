import type { CellRenderProps } from "../../types";
import type { CommonRow } from "../types/common";

type TestProps = {
  someCellProps?: number;
  someCellTestProps?: string;
};

export function TestCellRender(props: CellRenderProps<CommonRow, TestProps>) {
  const cell = props.settings?.someCellProps;

  return <div>{cell}</div>;
}
