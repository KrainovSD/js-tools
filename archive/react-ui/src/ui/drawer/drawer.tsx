import { Drawer as AntdDrawer } from "antd";
import type { DrawerProps as AntdDrawerProps } from "antd";
import type { JSX } from "react";

export interface DrawerProps extends AntdDrawerProps {}

export function Drawer(props: DrawerProps): JSX.Element {
  const { children, ...otherProps } = props;

  return <AntdDrawer {...otherProps}>{children}</AntdDrawer>;
}
