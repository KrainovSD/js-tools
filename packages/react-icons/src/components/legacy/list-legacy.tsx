import type { IconProps } from "../../types";

export function ListLegacy(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeX}
      height={sizeY}
      viewBox="0 0 16 17"
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
        d="M12.5 3.5C12.7761 3.5 13 3.72386 13 4C13 4.27614 12.7761 4.5 12.5 4.5H7.5C7.22386 4.5 7 4.27614 7 4C7 3.72386 7.22386 3.5 7.5 3.5H12.5Z"
        fill={color}
      />
      <path
        d="M12.5 6.5C12.7761 6.5 13 6.72386 13 7C13 7.27614 12.7761 7.5 12.5 7.5H7.5C7.22386 7.5 7 7.27614 7 7C7 6.72386 7.22386 6.5 7.5 6.5H12.5Z"
        fill={color}
      />
      <path
        d="M13 10C13 9.72386 12.7761 9.5 12.5 9.5H7.5C7.22386 9.5 7 9.72386 7 10C7 10.2761 7.22386 10.5 7.5 10.5H12.5C12.7761 10.5 13 10.2761 13 10Z"
        fill={color}
      />
      <path
        d="M12.5 12.5C12.7761 12.5 13 12.7239 13 13C13 13.2761 12.7761 13.5 12.5 13.5H7.5C7.22386 13.5 7 13.2761 7 13C7 12.7239 7.22386 12.5 7.5 12.5H12.5Z"
        fill={color}
      />
      <path
        d="M16 2.5C16 1.39543 15.1046 0.5 14 0.5H2C0.895431 0.5 0 1.39543 0 2.5L0 14.5C0 15.6046 0.895431 16.5 2 16.5H14C15.1046 16.5 16 15.6046 16 14.5V2.5ZM4 1.5V15.5H2C1.44772 15.5 1 15.0523 1 14.5V2.5C1 1.94772 1.44772 1.5 2 1.5H4ZM5 1.5H14C14.5523 1.5 15 1.94772 15 2.5V14.5C15 15.0523 14.5523 15.5 14 15.5H5V1.5Z"
        fill={color}
      />
    </svg>
  );
}
