import { Tag as AntdTag, theme } from "antd";
import type { TagProps as AntdTagProps } from "antd";
import { clsx } from "clsx";
import type { JSX } from "react";
import {
  baseStyles,
  fontStyles,
  primaryAppearanceStyles,
  secondaryAppearanceStyles,
} from "./styles";

interface TagProps extends AntdTagProps {
  appearance?: "primary" | "secondary";
  large?: boolean;
}

export function Tag(props: TagProps): JSX.Element {
  const { children, appearance, color, large, className = "", ...otherProps } = props;
  const { token } = theme.useToken();

  const getClassName = (appearance?: TagProps["appearance"]): string => {
    if (appearance === "primary") {
      return primaryAppearanceStyles(token);
    }
    if (appearance === "secondary") {
      return secondaryAppearanceStyles(token);
    }

    return "";
  };

  return (
    <AntdTag
      {...otherProps}
      color={color}
      className={clsx(getClassName(appearance), fontStyles(token, large), baseStyles, className)}
    >
      {children}
    </AntdTag>
  );
}
