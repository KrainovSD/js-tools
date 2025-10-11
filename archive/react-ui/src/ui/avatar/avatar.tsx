import { Avatar as AntdAvatar } from "antd";
import type { AvatarProps as AntdAvatarProps } from "antd";
import type { JSX } from "react";

export interface AvatarProps extends AntdAvatarProps {}

export function Avatar(props: AvatarProps): JSX.Element {
  const { children, ...otherProps } = props;

  return <AntdAvatar {...otherProps}>{children}</AntdAvatar>;
}
