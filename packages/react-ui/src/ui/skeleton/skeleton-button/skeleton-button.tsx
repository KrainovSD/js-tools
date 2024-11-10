import { ksdu } from "@krainovsd/utils";
import type { GetProps } from "antd";
import { Skeleton as AntdSkeleton } from "antd";
import type { JSX } from "react";

type Props = GetProps<typeof AntdSkeleton.Button> & {
  width?: string | number;
  height?: string | number;
};

export function SkeletonButton(props: Props): JSX.Element {
  const { active = true, ...otherProps } = props;

  let width: string | undefined;
  if (ksdu.typings.isNumber(otherProps.width)) width = `${otherProps.width}px`;
  if (ksdu.typings.isString(otherProps.width)) width = otherProps.width;

  let height: string | undefined;
  if (ksdu.typings.isNumber(otherProps.height)) height = `${otherProps.height}px`;
  if (ksdu.typings.isString(otherProps.height)) height = otherProps.height;

  return <AntdSkeleton.Button active={active} {...otherProps} style={{ width, height }} />;
}
