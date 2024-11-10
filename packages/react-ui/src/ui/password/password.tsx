import { Input as AntdInput } from "antd";
import type { GetProps } from "antd";
import type { JSX } from "react";

type Props = GetProps<typeof AntdInput.Password>;

export function Password(props: Props): JSX.Element {
  return <AntdInput.Password {...props} />;
}
