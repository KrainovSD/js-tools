import { DEFAULT_ICON, DEFAULT_SIZE_X, DEFAULT_SIZE_Y } from "./constants";
import { Icons } from "./icons";
import type { IconName, IconProps } from "./types";

export type IconComponentProps = {
  icon: IconName;
  defaultIcon?: IconName;
} & IconProps;

export function Icon(props: IconComponentProps) {
  const { icon, defaultIcon = DEFAULT_ICON, color = "currentColor", ...rest } = props;
  const CurrentIcon = Icons[icon] || Icons[defaultIcon];
  if (!CurrentIcon) return null;

  const sizeX = props.size || props.sizeX || DEFAULT_SIZE_X;
  const sizeY = props.size || props.sizeY || DEFAULT_SIZE_Y;

  return (
    <CurrentIcon
      {...rest}
      sizeX={sizeX}
      sizeY={sizeY}
      color={color}
      style={{
        fontSize: sizeY == undefined ? undefined : `${sizeY}px`,
        width: sizeX == undefined ? undefined : `${sizeX}px`,
        height: sizeY == undefined ? undefined : `${sizeY}px`,
        minWidth: sizeX == undefined ? undefined : `${sizeX}px`,
        minHeight: sizeY == undefined ? undefined : `${sizeY}px`,
        maxWidth: sizeX == undefined ? undefined : `${sizeX}px`,
        maxHeight: sizeY == undefined ? undefined : `${sizeY}px`,
        ...rest.style,
      }}
    />
  );
}
