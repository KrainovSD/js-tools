import type { IconProps } from "../../types";

export function ArrowFat(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeX}
      height={sizeY}
      viewBox="0 0 20 20"
      fill="none"
      {...rest}
    >
      <path
        d="M6.66699 5.28593L7.8455 4.10742L13.7381 9.99998L7.8455 15.8925L6.66699 14.714L11.381 9.99998L6.66699 5.28593Z"
        fill={color}
      />
    </svg>
  );
}
