import type { IconProps } from "../../types";

export function CalendarPlus(props: IconProps): React.JSX.Element {
  const { sizeX = 14, sizeY = 14, color = "#FFFFFF", ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M8 7C8.27614 7 8.5 7.22386 8.5 7.5V9H10C10.2761 9 10.5 9.22386 10.5 9.5C10.5 9.77614 10.2761 10 10 10H8.5V11.5C8.5 11.7761 8.27614 12 8 12C7.72386 12 7.5 11.7761 7.5 11.5V10H6C5.72386 10 5.5 9.77614 5.5 9.5C5.5 9.22386 5.72386 9 6 9H7.5V7.5C7.5 7.22386 7.72386 7 8 7Z"
        fill={color}
      />
      <path
        d="M3.5 0C3.77614 0 4 0.223858 4 0.5V1H12V0.5C12 0.223858 12.2239 0 12.5 0C12.7761 0 13 0.223858 13 0.5V1H14C15.1046 1 16 1.89543 16 3V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V3C0 1.89543 0.895431 1 2 1H3V0.5C3 0.223858 3.22386 0 3.5 0ZM1 4V14C1 14.5523 1.44772 15 2 15H14C14.5523 15 15 14.5523 15 14V4H1Z"
        fill={color}
      />
    </svg>
  );
}
