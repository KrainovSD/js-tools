import type { IconProps } from "../../types";

export function ArrowUpFillLegacy(props: IconProps): React.JSX.Element {
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
        d="M13.4623 10.1912C13.4244 10.2825 13.3604 10.3606 13.2782 10.4156C13.1959 10.4705 13.0993 10.4999 13.0004 10.4999H3.00039C2.90145 10.5 2.8047 10.4707 2.7224 10.4158C2.64011 10.3608 2.57596 10.2827 2.53808 10.1913C2.50021 10.0999 2.4903 9.99929 2.50963 9.90225C2.52895 9.80521 2.57664 9.71608 2.64664 9.64615L7.64664 4.64615C7.69308 4.59967 7.74823 4.56279 7.80892 4.53763C7.86962 4.51246 7.93469 4.49951 8.00039 4.49951C8.0661 4.49951 8.13117 4.51246 8.19186 4.53763C8.25256 4.56279 8.30771 4.59967 8.35414 4.64615L13.3541 9.64615C13.424 9.71612 13.4716 9.80524 13.4909 9.90225C13.5101 9.99926 13.5002 10.0998 13.4623 10.1912Z"
        fill={color}
      />
    </svg>
  );
}
