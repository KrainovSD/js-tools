import { Switch as AntdSwitch } from "antd";
import type { SwitchProps as AntdSwitchProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import * as styles from "./styles";

export interface SwitchProps extends AntdSwitchProps {
  customColorBgActive?: string;
  customColorBg?: string;
}

export function Switch(props: SwitchProps): JSX.Element {
  const { customColorBg, customColorBgActive, className, ...rest } = props;

  return (
    <AntdSwitch
      {...rest}
      className={clsx(
        styles.background(customColorBg, customColorBgActive),
        customColorBg && "off-custom-color",
        customColorBgActive && "active-custom-color",
        className,
      )}
    />
  );
}
