import { Skeleton as AntdSkeleton } from "antd";
import type { SkeletonProps } from "antd";
import { clsx } from "clsx";
import type { JSX } from "react";
import { imageStyles } from "./styles";

interface SkeletonImageProps extends SkeletonProps {
  size?: number;
}

export function SkeletonImage(props: SkeletonImageProps): JSX.Element {
  const { active = true, size, className, ...otherProps } = props;

  return (
    <AntdSkeleton.Image
      active={active}
      className={clsx(imageStyles(size), className)}
      {...otherProps}
    />
  );
}
