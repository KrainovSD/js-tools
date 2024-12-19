import { Skeleton as AntdSkeleton } from "antd";
import { clsx } from "clsx";
import type { JSX } from "react";
import * as styles from "./styles";

export interface SkeletonTitleProps {
  width?: number | string;
  wide?: boolean;
  active?: boolean;
  className?: string;
}

export function SkeletonTitle(props: SkeletonTitleProps): JSX.Element {
  const { width, active = true, wide, className } = props;

  return (
    <AntdSkeleton
      active={active}
      className={clsx(className, styles.base)}
      title={{ width: wide ? "100%" : width }}
      paragraph={{ rows: 0 }}
    />
  );
}
