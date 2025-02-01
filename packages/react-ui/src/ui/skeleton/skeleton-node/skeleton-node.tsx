import type { GetProps } from "antd";
import { Skeleton as AntdSkeleton } from "antd";
import clsx from "clsx";
import type { JSX } from "react";
import styles from "./skeleton-node.module.scss";

export type SkeletonNodeProps = GetProps<typeof AntdSkeleton.Node> & {
  wide?: boolean;
  full?: boolean;
  border?: boolean;
};

export function SkeletonNode(props: SkeletonNodeProps): JSX.Element {
  const { active = true, className, wide, full, border, ...otherProps } = props;

  return (
    <AntdSkeleton.Node
      active={active}
      className={clsx(
        wide && styles.wide,
        full && styles.full,
        !border && styles.square,
        className,
      )}
      {...otherProps}
    />
  );
}
