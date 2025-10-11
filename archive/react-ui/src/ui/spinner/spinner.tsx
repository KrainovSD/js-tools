import clsx from "clsx";
import * as styles from "./styles";

export type SpinnerSize = "normal" | "small";

export type SpinnerPropsInterface = {
  size?: SpinnerSize;
  color?: string;
  zIndex?: number;
};

export function Spinner(props: SpinnerPropsInterface) {
  const { color = "#8893a480", size = "normal", zIndex = 1000 } = props;

  return (
    <div className={clsx(styles.spinner, size)}>
      <div className={clsx(styles.inner(color, zIndex), "one")}></div>
      <div className={clsx(styles.inner(color, zIndex), "two")}></div>
      <div className={clsx(styles.inner(color, zIndex), "three")}></div>
    </div>
  );
}
