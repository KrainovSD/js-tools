import { Spin as AntdSpin } from "antd";
import type { SpinProps as AntdSpinProps } from "antd";
import type React from "react";
import { Spinner } from "../spinner";

interface SpinProps extends AntdSpinProps {
  iconSize?: number;
}

export function Spin(props: SpinProps): React.JSX.Element {
  const { indicator, ...otherProps } = props;

  return <AntdSpin indicator={indicator || <Spinner size="small" />} {...otherProps} />;
}
