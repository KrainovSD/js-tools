import type { IconProps } from "../../types";

export function Grid(props: IconProps): React.JSX.Element {
  const { sizeX = 14, sizeY = 14, color = "#FFFFFF", ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M0 2.25C0 1.00736 1.00736 0 2.25 0H21.75C22.9926 0 24 1.00736 24 2.25V21.75C24 22.9926 22.9926 24 21.75 24H2.25C1.00736 24 0 22.9926 0 21.75V2.25ZM2.25 1.5C1.83579 1.5 1.5 1.83579 1.5 2.25V7.5H7.5V1.5H2.25ZM7.5 9H1.5V15H7.5V9ZM9 15H15V9H9V15ZM7.5 16.5H1.5V21.75C1.5 22.1642 1.83579 22.5 2.25 22.5H7.5V16.5ZM9 16.5V22.5H15V16.5H9ZM16.5 16.5V22.5H21.75C22.1642 22.5 22.5 22.1642 22.5 21.75V16.5H16.5ZM16.5 15H22.5V9H16.5V15ZM16.5 7.5H22.5V2.25C22.5 1.83579 22.1642 1.5 21.75 1.5H16.5V7.5ZM15 7.5V1.5H9V7.5H15Z"
        fill={color}
      />
    </svg>
  );
}
