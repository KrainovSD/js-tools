import { Tag as AntdTag } from "antd";
import type { GetProps } from "antd";
import type { JSX } from "react";

export type CheckableTagProps = GetProps<typeof AntdTag.CheckableTag>;

export function CheckableTag(props: CheckableTagProps): JSX.Element {
  const { children, ...otherProps } = props;

  return <AntdTag.CheckableTag {...otherProps}>{children}</AntdTag.CheckableTag>;
}
