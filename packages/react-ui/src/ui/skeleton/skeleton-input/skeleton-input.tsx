import type { GetProps } from "antd";
import { Skeleton as AntdSkeleton } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import * as styles from "./style";

export type SkeletonInputProps = GetProps<typeof AntdSkeleton.Input> & {
  wide?: boolean;
};

export function SkeletonInput(props: SkeletonInputProps): JSX.Element {
  const { active = true, className, wide, ...otherProps } = props;

  return (
    <AntdSkeleton.Input
      active={active}
      className={clsx(styles.base, wide && "wide", className)}
      {...otherProps}
    />
  );
}
