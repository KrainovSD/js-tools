import type { IconProps } from "../../types";

export function ArrowLeft(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeX}
      height={sizeY}
      viewBox="0 0 14 14"
      fill="none"
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
      <g id="Phosphor /  arrow-left">
        <path
          id="Vector"
          d="M11.0657 4.94046C11.1064 4.89981 11.1546 4.86757 11.2077 4.84557C11.2608 4.82357 11.3178 4.81225 11.3752 4.81225C11.4327 4.81225 11.4897 4.82357 11.5428 4.84557C11.5959 4.86757 11.6441 4.89981 11.6848 4.94046C11.7254 4.98111 11.7577 5.02936 11.7797 5.08247C11.8017 5.13558 11.813 5.19251 11.813 5.24999C11.813 5.30748 11.8017 5.3644 11.7797 5.41751C11.7577 5.47062 11.7254 5.51887 11.6848 5.55952L7.30977 9.93452C7.26914 9.9752 7.22089 10.0075 7.16778 10.0295C7.11467 10.0515 7.05774 10.0628 7.00024 10.0628C6.94275 10.0628 6.88582 10.0515 6.83271 10.0295C6.7796 10.0075 6.73134 9.9752 6.69071 9.93452L2.31571 5.55952C2.23362 5.47743 2.1875 5.36609 2.1875 5.24999C2.1875 5.13389 2.23362 5.02255 2.31571 4.94046C2.3978 4.85837 2.50915 4.81225 2.62524 4.81225C2.74134 4.81225 2.85268 4.85837 2.93477 4.94046L7.00024 9.00648L11.0657 4.94046Z"
          fill={color}
        />
      </g>
    </svg>
  );
}
