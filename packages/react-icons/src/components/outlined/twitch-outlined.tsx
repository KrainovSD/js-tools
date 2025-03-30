import type { IconProps } from "../../types";

export function TwitchOutlined(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 1024 1024"
      fillRule="evenodd"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fontSize: sizeY == undefined ? undefined : `${sizeY}px`,
        width: sizeX == undefined ? undefined : `${sizeX}px`,
        height: sizeY == undefined ? undefined : `${sizeY}px`,
        minWidth: sizeX == undefined ? undefined : `${sizeX}px`,
        minHeight: sizeY == undefined ? undefined : `${sizeY}px`,
        maxWidth: sizeX == undefined ? undefined : `${sizeX}px`,
        maxHeight: sizeY == undefined ? undefined : `${sizeY}px`,
        ...style,
      }}
      {...rest}
    >
      <path
        d="M52.133 0 0 139.167v556.466h191.2V800h104.4l104.233-104.4h156.5L765 487V0zm69.534 69.5H695.5v382.633L573.767 573.867H382.5L278.267 678.1V573.867h-156.6zM313 417.4h69.5V208.733H313zm191.167 0H573.7V208.733h-69.533z"
        fill={color}
        transform="translate(114 112)"
      ></path>
    </svg>
  );
}
