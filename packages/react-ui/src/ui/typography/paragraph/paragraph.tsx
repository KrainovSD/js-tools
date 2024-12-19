import type { GetProps } from "antd";
import { Typography as AntdTypography } from "antd";
import type { JSX } from "react";

export type ParagraphProps = GetProps<typeof AntdTypography.Paragraph>;

export function Paragraph(props: ParagraphProps): JSX.Element {
  return <AntdTypography.Paragraph style={{ margin: 0 }} {...props} />;
}
