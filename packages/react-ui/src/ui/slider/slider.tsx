import type { SliderSingleProps as AntdSliderSingleProps } from "antd";
import { Slider as AntdSlider } from "antd";
import { type SliderRangeProps as AntdSlideRangeProps } from "antd/es/slider";
import clsx from "clsx";
import type { JSX } from "react";
import { styles } from "./styles";

export interface SliderSingleProps extends AntdSliderSingleProps {}
export interface SliderRangeProps extends Omit<AntdSlideRangeProps, "range"> {}

export function SliderSingle(props: SliderSingleProps): JSX.Element {
  const { className, ...rest } = props;

  return <AntdSlider {...rest} className={clsx(styles.base, className)} />;
}

export function SliderRange(props: SliderRangeProps): JSX.Element {
  const { className, ...rest } = props;

  return (
    <AntdSlider
      {...rest}
      range={{ draggableTrack: true }}
      className={clsx(styles.base, className)}
    />
  );
}
