import type { IconProps } from "../../types";

export function OffersFillLegacy(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeX}
      height={sizeY}
      viewBox="0 0 16 16"
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
      <path
        d="M9.5 7C9.5 7.13261 9.44732 7.25979 9.35355 7.35355C9.25979 7.44732 9.13261 7.5 9 7.5H7C6.86739 7.5 6.74021 7.44732 6.64645 7.35355C6.55268 7.25979 6.5 7.13261 6.5 7C6.5 6.86739 6.55268 6.74021 6.64645 6.64645C6.74021 6.55268 6.86739 6.5 7 6.5H9C9.13261 6.5 9.25979 6.55268 9.35355 6.64645C9.44732 6.74021 9.5 6.86739 9.5 7ZM14.5 4.5V12.5C14.5 12.7652 14.3946 13.0196 14.2071 13.2071C14.0196 13.3946 13.7652 13.5 13.5 13.5H2.5C2.23478 13.5 1.98043 13.3946 1.79289 13.2071C1.60536 13.0196 1.5 12.7652 1.5 12.5V4.5C1.5 4.23478 1.60536 3.98043 1.79289 3.79289C1.98043 3.60536 2.23478 3.5 2.5 3.5H5V3C5 2.60218 5.15804 2.22064 5.43934 1.93934C5.72064 1.65804 6.10218 1.5 6.5 1.5H9.5C9.89782 1.5 10.2794 1.65804 10.5607 1.93934C10.842 2.22064 11 2.60218 11 3V3.5H13.5C13.7652 3.5 14.0196 3.60536 14.2071 3.79289C14.3946 3.98043 14.5 4.23478 14.5 4.5ZM6 3.5H10V3C10 2.86739 9.94732 2.74021 9.85355 2.64645C9.75979 2.55268 9.63261 2.5 9.5 2.5H6.5C6.36739 2.5 6.24021 2.55268 6.14645 2.64645C6.05268 2.74021 6 2.86739 6 3V3.5ZM13.5 7.10063V4.5H2.5V7.10063C4.18764 8.01924 6.07855 8.50034 8 8.5C9.92145 8.50034 11.8124 8.01924 13.5 7.10063Z"
        fill={color}
      />
    </svg>
  );
}
