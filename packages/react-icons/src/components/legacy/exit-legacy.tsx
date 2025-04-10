import type { IconProps } from "../../types";

export function ExitLegacy(props: IconProps): React.JSX.Element {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 3.5C6 3.22386 6.22386 3 6.5 3L14.5 3C14.7761 3 15 3.22386 15 3.5V12.5C15 12.7761 14.7761 13 14.5 13H6.5C6.22386 13 6 12.7761 6 12.5V10.5C6 10.2239 5.77614 10 5.5 10C5.22386 10 5 10.2239 5 10.5V12.5C5 13.3284 5.67157 14 6.5 14H14.5C15.3284 14 16 13.3284 16 12.5V3.5C16 2.67157 15.3284 2 14.5 2L6.5 2C5.67157 2 5 2.67157 5 3.5V5.5C5 5.77614 5.22386 6 5.5 6C5.77614 6 6 5.77614 6 5.5V3.5Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.8536 8.35355C12.0488 8.15829 12.0488 7.84171 11.8536 7.64645L8.85355 4.64645C8.65829 4.45118 8.34171 4.45118 8.14645 4.64645C7.95118 4.84171 7.95118 5.15829 8.14645 5.35355L10.2929 7.5L1.5 7.5C1.22386 7.5 1 7.72386 1 8C1 8.27614 1.22386 8.5 1.5 8.5H10.2929L8.14645 10.6464C7.95118 10.8417 7.95118 11.1583 8.14645 11.3536C8.34171 11.5488 8.65829 11.5488 8.85355 11.3536L11.8536 8.35355Z"
        fill={color}
      />
    </svg>
  );
}
