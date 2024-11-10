import { Skeleton as AntdSkeleton } from "antd";
import { clsx } from "clsx";
import type { JSX } from "react";
import { titleStyles } from "./styles";

export interface SkeletonTitleProps {
  width?: number | string;
  active?: boolean;
  className?: string;
}

export function SkeletonTitle(props: SkeletonTitleProps): JSX.Element {
  const { width, active = true, className } = props;

  return (
    <AntdSkeleton
      active={active}
      className={clsx(className, titleStyles)}
      title={{ width }}
      paragraph={{ rows: 0 }}
    />
  );
}
