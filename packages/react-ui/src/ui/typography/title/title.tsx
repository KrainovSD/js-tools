import type { GetProps } from "antd";
import { Typography as AntdTypography } from "antd";
import type { JSX } from "react";

type TitleProps = GetProps<typeof AntdTypography.Title>;

export function Title(props: TitleProps): JSX.Element {
  return <AntdTypography.Title style={{ margin: 0 }} {...props} />;
}
