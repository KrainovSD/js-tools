import type { IconProps } from "../../types";

export function FrameLegacy(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 24 24"
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
        d="M2.25 1.5C1.83579 1.5 1.5 1.83579 1.5 2.25V8.25C1.5 8.66421 1.16421 9 0.75 9C0.335786 9 0 8.66421 0 8.25V2.25C0 1.00736 1.00736 0 2.25 0H8.25C8.66421 0 9 0.335786 9 0.75C9 1.16421 8.66421 1.5 8.25 1.5H2.25ZM15 0.75C15 0.335786 15.3358 0 15.75 0H21.75C22.9926 0 24 1.00736 24 2.25V8.25C24 8.66421 23.6642 9 23.25 9C22.8358 9 22.5 8.66421 22.5 8.25V2.25C22.5 1.83579 22.1642 1.5 21.75 1.5H15.75C15.3358 1.5 15 1.16421 15 0.75ZM0.75 15C1.16421 15 1.5 15.3358 1.5 15.75V21.75C1.5 22.1642 1.83579 22.5 2.25 22.5H8.25C8.66421 22.5 9 22.8358 9 23.25C9 23.6642 8.66421 24 8.25 24H2.25C1.00736 24 0 22.9926 0 21.75V15.75C0 15.3358 0.335786 15 0.75 15ZM23.25 15C23.6642 15 24 15.3358 24 15.75V21.75C24 22.9926 22.9926 24 21.75 24H15.75C15.3358 24 15 23.6642 15 23.25C15 22.8358 15.3358 22.5 15.75 22.5H21.75C22.1642 22.5 22.5 22.1642 22.5 21.75V15.75C22.5 15.3358 22.8358 15 23.25 15Z"
        fill={color}
      />
    </svg>
  );
}
