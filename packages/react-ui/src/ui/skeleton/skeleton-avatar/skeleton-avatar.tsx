import type { GetProps } from "antd";
import { Skeleton as AntdSkeleton } from "antd";
import type { JSX } from "react";

export type SkeletonAvatarPropsInterface = GetProps<typeof AntdSkeleton.Avatar>;

export function SkeletonAvatar(props: SkeletonAvatarPropsInterface): JSX.Element {
  const { active = true, shape = "square", size = "small", style, ...otherProps } = props;

  let borderRadius: number | undefined;
  if (shape === "square" && size === "small") borderRadius = 4;
  if (shape === "square" && size === "default") borderRadius = 6;
  if (shape === "square" && size === "large") borderRadius = 8;

  return (
    <AntdSkeleton.Avatar
      active={active}
      size={size}
      shape={shape}
      style={{ ...(style || {}), borderRadius }}
      {...otherProps}
    />
  );
}
