import { Tag as AntdTag } from "antd";
import type { TagProps as AntdTagProps } from "antd";
import { clsx } from "clsx";
import type { JSX } from "react";

export interface TagProps extends AntdTagProps {
  mainColor?: string;
  checked?: boolean;
}

export function Tag(props: TagProps): JSX.Element {
  const { children, style, className, mainColor, checked, ...otherProps } = props;

  let border: string | undefined;
  if (checked && mainColor) {
    border = `1px solid ${mainColor}`;
  } else if (mainColor) {
    border = `1px solid transparent`;
  }

  return (
    <AntdTag
      {...otherProps}
      className={clsx(className)}
      style={{
        ...(style || {
          cursor: "pointer",
          color: mainColor,
          border,
        }),
      }}
    >
      {children}
    </AntdTag>
  );
}
