import clsx from "clsx";
import { COLORS } from "../../config";
import * as styles from "./styles";

export type SpinnerSize = "normal" | "small";

type Props = {
  size?: SpinnerSize;
  color?: string;
  zIndex?: number;
};

export function Spinner(props: Props) {
  const { color = COLORS.greyPrimary, size = "normal", zIndex = 1000 } = props;

  return (
    <div className={clsx(styles.spinner, size)}>
      <div className={clsx(styles.inner(color, zIndex), "one")}></div>
      <div className={clsx(styles.inner(color, zIndex), "two")}></div>
      <div className={clsx(styles.inner(color, zIndex), "three")}></div>
    </div>
  );
}
