import type { IconProps } from "../../types";

export function StatisticLegacy(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 18 18"
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
        d="M15.75 6.75H12.9375V3.9375C12.9375 3.78832 12.8782 3.64524 12.7727 3.53975C12.6673 3.43426 12.5242 3.375 12.375 3.375H3.9375V2.8125C3.9375 2.66332 3.87824 2.52024 3.77275 2.41475C3.66726 2.30926 3.52418 2.25 3.375 2.25C3.22582 2.25 3.08274 2.30926 2.97725 2.41475C2.87176 2.52024 2.8125 2.66332 2.8125 2.8125V15.1875C2.8125 15.3367 2.87176 15.4798 2.97725 15.5852C3.08274 15.6907 3.22582 15.75 3.375 15.75C3.52418 15.75 3.66726 15.6907 3.77275 15.5852C3.87824 15.4798 3.9375 15.3367 3.9375 15.1875V14.625H10.125C10.2742 14.625 10.4173 14.5657 10.5227 14.4602C10.6282 14.3548 10.6875 14.2117 10.6875 14.0625V11.25H15.75C15.8992 11.25 16.0423 11.1907 16.1477 11.0852C16.2532 10.9798 16.3125 10.8367 16.3125 10.6875V7.3125C16.3125 7.16332 16.2532 7.02024 16.1477 6.91475C16.0423 6.80926 15.8992 6.75 15.75 6.75ZM11.8125 4.5V6.75H3.9375V4.5H11.8125ZM9.5625 13.5H3.9375V11.25H9.5625V13.5ZM15.1875 10.125H3.9375V7.875H15.1875V10.125Z"
        fill={color}
      />
    </svg>
  );
}
