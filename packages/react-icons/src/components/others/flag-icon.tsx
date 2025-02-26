import type { IconProps } from "../../types";

export function Flag(props: IconProps): React.JSX.Element {
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
        d="M14.5 3.50001V11C14.4996 11.0712 14.484 11.1415 14.4543 11.2061C14.4245 11.2708 14.3813 11.3284 14.3275 11.375C13.3725 12.2019 12.4594 12.5 11.5887 12.5C10.4069 12.5 9.30312 11.9538 8.27625 11.4469C6.61687 10.625 5.17438 9.91314 3.5 11.2356V14C3.5 14.1326 3.44732 14.2598 3.35355 14.3536C3.25979 14.4473 3.13261 14.5 3 14.5C2.86739 14.5 2.74021 14.4473 2.64645 14.3536C2.55268 14.2598 2.5 14.1326 2.5 14V3.50001C2.50048 3.42878 2.51617 3.35847 2.54603 3.2938C2.57589 3.22913 2.61922 3.17158 2.67313 3.12501C4.92313 1.17626 6.9425 2.17439 8.7225 3.05501C10.4375 3.90376 11.9244 4.63751 13.6725 3.12501C13.7448 3.06238 13.8335 3.02178 13.9281 3.00802C14.0227 2.99427 14.1193 3.00793 14.2064 3.0474C14.2935 3.08687 14.3674 3.15049 14.4195 3.23071C14.4715 3.31093 14.4995 3.40439 14.5 3.50001Z"
        fill={color}
      />
    </svg>
  );
}
