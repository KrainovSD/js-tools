import { Badge as AntdBadge } from "antd";
import type { BadgeProps as AntdBadgeProps } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import styles from "./badge.module.scss";

export interface BadgeProps extends AntdBadgeProps {
  custom?: boolean;
  customColor?: string;
  customSize?: number;
}

export function Badge(props: BadgeProps): JSX.Element {
  const { children, custom, customSize, customColor = "inherit", ...otherProps } = props;

  if (custom)
    return (
      <div
        className={clsx(styles.base, custom && styles.custom)}
        style={{
          backgroundColor: customColor,
          width: customSize,
          height: customSize,
          minWidth: customSize,
          minHeight: customSize,
        }}
      ></div>
    );

  return <AntdBadge {...otherProps}>{children}</AntdBadge>;
}
