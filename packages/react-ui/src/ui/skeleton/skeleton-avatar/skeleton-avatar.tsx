import type { GetProps } from "antd";
import { Skeleton as AntdSkeleton } from "antd";
import type { JSX } from "react";

type Props = GetProps<typeof AntdSkeleton.Avatar>;

export function SkeletonAvatar(props: Props): JSX.Element {
  const { active = true, ...otherProps } = props;

  return <AntdSkeleton.Avatar active={active} {...otherProps} />;
}
