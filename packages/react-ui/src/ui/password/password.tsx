import { Input as AntdInput } from "antd";
import type { GetProps } from "antd";
import type { JSX } from "react";

export type PasswordPropsInterface = GetProps<typeof AntdInput.Password>;

export function Password(props: PasswordPropsInterface): JSX.Element {
  return <AntdInput.Password {...props} />;
}
