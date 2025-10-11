import type { HeaderRenderProps } from "../../types";
import type { CommonRow } from "../types/common";

type TestProps = {
  someHeaderProps?: number;
  someHeaderTestProps?: string;
};

export function TestHeaderRender(props: HeaderRenderProps<CommonRow, TestProps>) {
  const cell = props.settings?.someHeaderProps;

  return <div>{cell}</div>;
}
