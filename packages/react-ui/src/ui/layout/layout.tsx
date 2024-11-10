import { Layout as AntdLayout } from "antd";
import type { LayoutProps as AntdLayoutProps } from "antd";
import type { JSX } from "react";

interface LayoutProps extends AntdLayoutProps {}

export function Layout(props: LayoutProps): JSX.Element {
  const { children, ...otherProps } = props;

  return <AntdLayout {...otherProps}>{children}</AntdLayout>;
}
