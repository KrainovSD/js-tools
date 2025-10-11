import { Skeleton as AntdSkeleton } from "antd";
import type { SkeletonProps as AntdSkeletonProps } from "antd";
import { clsx } from "clsx";
import type { JSX } from "react";
import * as styles from "./styles";

interface SkeletonProps extends AntdSkeletonProps {}

export function Skeleton(props: SkeletonProps): JSX.Element {
  const { className, ...otherProps } = props;

  return <AntdSkeleton {...otherProps} className={clsx(styles.base, className)} />;
}
