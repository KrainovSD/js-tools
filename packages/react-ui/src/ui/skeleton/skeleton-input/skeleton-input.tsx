import type { GetProps } from "antd";
import { Skeleton as AntdSkeleton } from "antd";
import type { JSX } from "react";
import { inputStyles } from "./style";

type SkeletonInputProps = GetProps<typeof AntdSkeleton.Input> & {
  width: string | number;
};

export function SkeletonInput(props: SkeletonInputProps): JSX.Element {
  const { width, active = true, ...otherProps } = props;

  return <AntdSkeleton.Input active={active} {...otherProps} className={inputStyles(width)} />;
}
