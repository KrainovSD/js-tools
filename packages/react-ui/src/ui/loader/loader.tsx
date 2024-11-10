import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import { COLORS } from "../../config";
import { Flex } from "../flex";
import { Spinner } from "../spinner";
import { Text } from "../typography";
import { styles } from "./styles";

type Props = {
  background?: "full" | "common" | "none";
  target?: string;
  zIndex?: number;
  color?: string;
  percent?: number;
};

export function Loader(props: Props) {
  const { background = "none", color = COLORS.greyPrimary, zIndex = 1000 } = props;
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

  if (background === "none") return <Spinner color={color} zIndex={zIndex} />;

  const LoaderComponent = (
    <Flex
      align="center"
      justify="center"
      className={clsx(styles.back(zIndex), background === "full" && "full")}
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
