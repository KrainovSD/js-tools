import type { GetProps } from "antd";
import { Typography as AntdTypography } from "antd";
import type { JSX } from "react";

type LinkProps = GetProps<typeof AntdTypography.Link>;

export function Link(props: LinkProps): JSX.Element {
  return <AntdTypography.Link {...props} />;
}
