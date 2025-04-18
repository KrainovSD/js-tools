import type { IconProps } from "../../types";

export function ModuleLegacy(props: IconProps): React.JSX.Element {
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
        d="M2.5 3.5C2.22386 3.5 2 3.27614 2 3C2 2.72386 2.22386 2.5 2.5 2.5H13.5C13.7761 2.5 14 2.72386 14 3C14 3.27614 13.7761 3.5 13.5 3.5H2.5Z"
        fill={color}
      />
      <path
        d="M4.5 1.5C4.22386 1.5 4 1.27614 4 1C4 0.723858 4.22386 0.5 4.5 0.5H11.5C11.7761 0.5 12 0.723858 12 1C12 1.27614 11.7761 1.5 11.5 1.5H4.5Z"
        fill={color}
      />
      <path
        d="M0 13C0 13.8284 0.671573 14.5 1.5 14.5H14.5C15.3284 14.5 16 13.8284 16 13V6C16 5.17157 15.3284 4.5 14.5 4.5H1.5C0.671573 4.5 0 5.17157 0 6V13ZM1.5 13.5C1.22386 13.5 1 13.2761 1 13V6C1 5.72386 1.22386 5.5 1.5 5.5H14.5C14.7761 5.5 15 5.72386 15 6V13C15 13.2761 14.7761 13.5 14.5 13.5H1.5Z"
        fill={color}
      />
    </svg>
  );
}
