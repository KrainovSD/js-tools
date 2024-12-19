import { Popconfirm as AntdPopconfirm } from "antd";
import type { PopconfirmProps as AntdPopconfirmProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";

export interface PopconfirmProps extends AntdPopconfirmProps {}

export function Popconfirm(props: PopconfirmProps): JSX.Element {
  const { className, ...rest } = props;

  return <AntdPopconfirm {...rest} className={clsx(className)} />;
}
