import type { IconProps } from "../../types";

export function PlayLegacy(props: IconProps): React.JSX.Element {
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
        d="M15 7.99982C15.0004 8.16959 14.9569 8.33657 14.8736 8.48454C14.7904 8.6325 14.6703 8.7564 14.525 8.8442L5.52 14.3529C5.36818 14.4459 5.19429 14.4967 5.0163 14.5C4.83831 14.5033 4.66266 14.459 4.5075 14.3717C4.35382 14.2858 4.2258 14.1605 4.1366 14.0087C4.04741 13.8568 4.00026 13.684 4 13.5079V2.4917C4.00026 2.31563 4.04741 2.1428 4.1366 1.99099C4.2258 1.83919 4.35382 1.71388 4.5075 1.62795C4.66266 1.54067 4.83831 1.49639 5.0163 1.49968C5.19429 1.50298 5.36818 1.55373 5.52 1.6467L14.525 7.15545C14.6703 7.24324 14.7904 7.36715 14.8736 7.51511C14.9569 7.66307 15.0004 7.83006 15 7.99982Z"
        fill={color}
      />
    </svg>
  );
}
