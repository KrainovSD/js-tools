import { Dropdown as AntdDropDown } from "antd";
import type { DropDownProps as AntdDropDownProps } from "antd";

export interface DropDownProps extends AntdDropDownProps {}

export function DropDown(props: DropDownProps) {
  return <AntdDropDown {...props} />;
}
