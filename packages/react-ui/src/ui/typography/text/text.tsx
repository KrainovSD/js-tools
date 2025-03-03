import type { GetProps } from "antd";
import { Typography as AntdTypography } from "antd";
import { clsx } from "clsx";
import type { JSX } from "react";

export type TextProps = GetProps<typeof AntdTypography.Text>;

export function Text(props: TextProps): JSX.Element {
  const { color, className, style, ...otherProps } = props;

  return (
    <AntdTypography.Text
      {...otherProps}
      className={clsx(className)}
      style={{ ...(style ?? {}), color }}
    />
  );
}
