import { Skeleton as AntdSkeleton } from "antd";
import type { SkeletonProps } from "antd";
import { clsx } from "clsx";
import type { JSX } from "react";
import * as styles from "./styles";

export interface SkeletonImagePropsInterface extends SkeletonProps {
  size?: number;
}

export function SkeletonImage(props: SkeletonImagePropsInterface): JSX.Element {
  const { active = true, size, className, ...otherProps } = props;

  return (
    <AntdSkeleton.Image
      active={active}
      className={clsx(styles.image(size), className)}
      {...otherProps}
    />
  );
}
