import { Flex as AntdFlex } from "antd";
import type { FlexProps as AntdFlexProps } from "antd";
import clsx from "clsx";
import { type JSX, forwardRef } from "react";
import { styles } from "./styles";

// gap prop values
// large - 24px
// middle - 16px
// small - 8px

interface FlexProps extends AntdFlexProps {
  wide?: boolean;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(props, ref): JSX.Element {
  const { children, wide, className, ...otherProps } = props;

  return (
    <AntdFlex ref={ref} {...otherProps} className={clsx(className, wide && styles.wide)}>
      {children}
    </AntdFlex>
  );
});
