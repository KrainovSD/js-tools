import { Checkbox as AntdCheckBox } from "antd";
import type { CheckboxProps as AntdCheckBoxProps } from "antd";
import type { JSX, PropsWithChildren } from "react";

export interface CheckBoxProps extends AntdCheckBoxProps {}

export function CheckBox({ children, ...props }: PropsWithChildren<CheckBoxProps>): JSX.Element {
  return <AntdCheckBox {...props}>{children}</AntdCheckBox>;
}
