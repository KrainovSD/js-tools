import { Popover as AntdPopover } from "antd";
import type { PopoverProps as AntdPopoverProps } from "antd";
import type { JSX } from "react";

export interface PopoverProps extends AntdPopoverProps {}

export function Popover(props: PopoverProps): JSX.Element {
  return <AntdPopover {...props} />;
}
