import { getUniqueId } from "../../lib";
import type { IconProps } from "../../types";

const UNIQUE_ID_NUMBER_1 = getUniqueId();

export function XFilled(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 1024 1024"
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
      <g
        clipPath={`url(#${UNIQUE_ID_NUMBER_1})`}
        fill="none"
        fillRule="evenodd"
        stroke="none"
        strokeWidth="1"
        transform="translate(112 112)"
      >
        <path
          d="M711.111 800H88.89C39.8 800 0 760.2 0 711.111V88.89C0 39.8 39.8 0 88.889 0H711.11C760.2 0 800 39.8 800 88.889V711.11C800 760.2 760.2 800 711.111 800"
          fill={color}
        ></path>

        <path
          d="M628 623H484.942L174 179h143.058zm-126.012-37.651h56.96L300.013 216.65h-56.96z"
          fill={color}
          fillRule="nonzero"
        ></path>

        <path
          d="M219.296885 623 379 437.732409 358.114212 410 174 623z"
          fill={color}
          fillRule="nonzero"
        ></path>

        <path
          d="M409 348.387347 429.212986 377 603 177 558.330417 177z"
          fill={color}
          fillRule="nonzero"
        ></path>
      </g>
    </svg>
  );
}
