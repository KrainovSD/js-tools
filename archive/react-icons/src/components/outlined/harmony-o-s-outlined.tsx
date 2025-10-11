import { getUniqueId } from "../../lib";
import type { IconProps } from "../../types";

const UNIQUE_ID_NUMBER_1 = getUniqueId();

export function HarmonyOSOutlined(props: IconProps): React.JSX.Element {
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
      <g clipPath={`url(#${UNIQUE_ID_NUMBER_1})`} transform="translate(134 65)">
        <path
          d="M377.5 0C585.987 0 755 169.013 755 377.5S585.987 755 377.5 755 0 585.987 0 377.5 169.013 0 377.5 0m0 64C204.359 64 64 204.359 64 377.5S204.359 691 377.5 691 691 550.641 691 377.5 550.641 64 377.5 64"
          fill={color}
        ></path>

        <path d="M611 824 611 896 144 896 144 824z" fill={color}></path>
      </g>
    </svg>
  );
}
