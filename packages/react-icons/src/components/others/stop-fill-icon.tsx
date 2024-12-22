import type { IconProps } from "../../types";

export function StopFill(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "#FFFFFF", ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 20 20"
      fill="#4CAF50"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM8.125 6.25C7.08947 6.25 6.25 7.08947 6.25 8.125V11.875C6.25 12.9105 7.08947 13.75 8.125 13.75H11.875C12.9105 13.75 13.75 12.9105 13.75 11.875V8.125C13.75 7.08947 12.9105 6.25 11.875 6.25H8.125Z"
        fill={color}
      />
    </svg>
  );
}
