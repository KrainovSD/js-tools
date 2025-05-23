import type { IconProps } from "../../types";

export function SaveLegacy(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 16 16"
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
        d="M13.7069 4.50001L11.5 2.29313C11.4075 2.19987 11.2973 2.12593 11.176 2.0756C11.0546 2.02528 10.9245 1.99959 10.7931 2.00001H3C2.73478 2.00001 2.48043 2.10536 2.29289 2.2929C2.10536 2.48043 2 2.73479 2 3.00001V13C2 13.2652 2.10536 13.5196 2.29289 13.7071C2.48043 13.8946 2.73478 14 3 14H13C13.2652 14 13.5196 13.8946 13.7071 13.7071C13.8946 13.5196 14 13.2652 14 13V5.20688C14.0004 5.07551 13.9747 4.94537 13.9244 4.82402C13.8741 4.70266 13.8001 4.59253 13.7069 4.50001ZM10.5 13H5.5V9.50001H10.5V13ZM13 13H11.5V9.50001C11.5 9.23479 11.3946 8.98044 11.2071 8.7929C11.0196 8.60536 10.7652 8.50001 10.5 8.50001H5.5C5.23478 8.50001 4.98043 8.60536 4.79289 8.7929C4.60536 8.98044 4.5 9.23479 4.5 9.50001V13H3V3.00001H10.7931L13 5.20688V13ZM10 4.50001C10 4.63261 9.94732 4.75979 9.85355 4.85356C9.75979 4.94733 9.63261 5.00001 9.5 5.00001H6C5.86739 5.00001 5.74021 4.94733 5.64645 4.85356C5.55268 4.75979 5.5 4.63261 5.5 4.50001C5.5 4.3674 5.55268 4.24022 5.64645 4.14645C5.74021 4.05268 5.86739 4.00001 6 4.00001H9.5C9.63261 4.00001 9.75979 4.05268 9.85355 4.14645C9.94732 4.24022 10 4.3674 10 4.50001Z"
        fill={color}
      />
    </svg>
  );
}
