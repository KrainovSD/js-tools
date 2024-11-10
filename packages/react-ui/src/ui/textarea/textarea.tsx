import { Input as AntdInput } from "antd";
import type { GetProps } from "antd";
import type { JSX } from "react";

type TextAreaProps = GetProps<typeof AntdInput.TextArea>;

export function TextArea(props: TextAreaProps): JSX.Element {
  return <AntdInput.TextArea {...props} />;
}
