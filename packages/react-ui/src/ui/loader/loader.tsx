import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import { Flex } from "../flex";
import { Spinner } from "../spinner";
import { Text } from "../typography";
import * as styles from "./styles";

export type LoaderPropsInterface = {
  background?: "page" | "block" | "single";
  target?: string;
  zIndex?: number;
  color?: string;
  percent?: number;
};

export function Loader(props: LoaderPropsInterface) {
  const { background = "none", color = "#8893a4", zIndex = 1000 } = props;
  const percent = React.useMemo(() => {
    if (props.percent && props.percent < 100) return props.percent;
    if (props.percent && props.percent >= 100) return 99;

    return null;
  }, [props.percent]);

  const target = React.useMemo(() => {
    if (props.target) {
      let element: HTMLElement | null = null;
      try {
        element = document.getElementById(props.target);
      } catch {
        element = document.body;
      }

      return element;
    }

    return null;
  }, [props.target]);

  if (background === "single") return <Spinner color={color} zIndex={zIndex} />;

  const LoaderComponent = (
    <Flex
      align="center"
      justify="center"
      className={clsx(styles.background, background)}
      style={{ zIndex }}
    >
      <Spinner color={color} zIndex={zIndex} />
      {percent != undefined && <Text className={styles.text}>{`${percent}%`} </Text>}
    </Flex>
  );

  if (target) {
    return createPortal(LoaderComponent, target);
  }

  return LoaderComponent;
}
