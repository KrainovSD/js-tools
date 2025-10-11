import type { GetProps } from "antd";
import { Skeleton as AntdSkeleton } from "antd";
import type { JSX } from "react";

export type SkeletonButtonPropsInterface = GetProps<typeof AntdSkeleton.Button> & {
  width?: number;
  height?: number;
};

export function SkeletonButton(props: SkeletonButtonPropsInterface): JSX.Element {
  const { active = true, width, height, style, ...otherProps } = props;

  return (
    <AntdSkeleton.Button
      active={active}
      style={{ ...(style ?? {}), width, minWidth: width, height }}
      {...otherProps}
    />
  );
}
