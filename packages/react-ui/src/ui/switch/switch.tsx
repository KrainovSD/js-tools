import { Switch as AntdSwitch } from "antd";
import type { SwitchProps as AntdSwitchProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import { styles } from "./styles";

export interface SwitchProps extends AntdSwitchProps {
  customColorBgActive?: string;
  customColorBg?: string;
}

export function Switch(props: SwitchProps): JSX.Element {
  const { customColorBg, customColorBgActive, ...rest } = props;

  return (
    <AntdSwitch
      {...rest}
      className={clsx(
        customColorBg && !props.checked && styles.bgColor(customColorBg),
        customColorBgActive && props.checked && styles.bgColorActive(customColorBgActive),
      )}
    />
  );
}
