import type { IconProps } from "../../types";

export function PlayOneLegacy(props: IconProps): React.JSX.Element {
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
        d="M13.304 15.5V11.092H12.168V10.492C12.3813 10.476 12.5733 10.452 12.744 10.42C12.9147 10.3827 13.0667 10.3213 13.2 10.236C13.3333 10.1453 13.4507 10.0147 13.552 9.844H14.152V15.5H13.304Z"
        fill={color}
      />
      <path
        d="M13 8.00007C13.0004 8.16983 12.9569 8.33682 12.8736 8.48478C12.7904 8.63274 12.6703 8.75665 12.525 8.84444L3.52 14.3532C3.36818 14.4462 3.19429 14.4969 3.0163 14.5002C2.83831 14.5035 2.66266 14.4592 2.5075 14.3719C2.35382 14.286 2.2258 14.1607 2.1366 14.0089C2.04741 13.8571 2.00026 13.6843 2 13.5082V2.49194C2.00026 2.31587 2.04741 2.14304 2.1366 1.99124C2.2258 1.83943 2.35382 1.71412 2.5075 1.62819C2.66266 1.54091 2.83831 1.49663 3.0163 1.49993C3.19429 1.50322 3.36818 1.55398 3.52 1.64694L12.525 7.15569C12.6703 7.24349 12.7904 7.36739 12.8736 7.51535C12.9569 7.66332 13.0004 7.8303 13 8.00007Z"
        fill={color}
      />
    </svg>
  );
}
