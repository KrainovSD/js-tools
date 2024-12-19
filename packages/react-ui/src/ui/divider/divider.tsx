import { Divider as AntdDivider } from "antd";
import type { DividerProps as AntdDividerProps } from "antd";
import { clsx } from "clsx";
import * as styles from "./styles";

export interface DividerProps extends AntdDividerProps {
  horizontalMargin?: number;
  verticalMargin?: number;
  size?: number;
  color?: string;
}

export function Divider(props: DividerProps) {
  const { size, horizontalMargin, verticalMargin, className, style, color, ...otherProps } = props;

  return (
    <AntdDivider
      className={clsx(styles.base, className)}
      style={{
        ...(style || {}),
        margin: `${verticalMargin || 0}px ${horizontalMargin || 0}px`,
        borderWidth: size,
        borderColor: color,
      }}
      {...otherProps}
    />
  );
}
