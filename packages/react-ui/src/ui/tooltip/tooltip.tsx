import { Tooltip as AntdTooltip, type TooltipProps as AntdTooltipProps } from "antd";
import type React from "react";

type TooltipProps = AntdTooltipProps;

export function Tooltip(props: TooltipProps): React.JSX.Element {
  const { children, ...otherProps } = props;

  return <AntdTooltip {...otherProps}>{children}</AntdTooltip>;
}
