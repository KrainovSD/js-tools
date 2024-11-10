import type { GetProps } from "antd";
import { Typography as AntdTypography } from "antd";
import { clsx } from "clsx";
import type { JSX } from "react";
import { textColorStyles } from "./styles";

type TextProps = GetProps<typeof AntdTypography.Text>;

export function Text(props: TextProps): JSX.Element {
  const { color, className, ...otherProps } = props;

  return (
    <AntdTypography.Text
      {...otherProps}
      className={clsx(color ? textColorStyles(color) : undefined, className)}
    />
  );
}
