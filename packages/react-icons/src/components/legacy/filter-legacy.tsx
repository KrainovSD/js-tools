import type { IconProps } from "../../types";

export function FilterLegacy(props: IconProps): React.JSX.Element {
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
        d="M12.75 8.5C12.75 8.69891 12.671 8.88968 12.5303 9.03033C12.3897 9.17098 12.1989 9.25 12 9.25H4C3.80109 9.25 3.61032 9.17098 3.46967 9.03033C3.32902 8.88968 3.25 8.69891 3.25 8.5C3.25 8.30109 3.32902 8.11032 3.46967 7.96967C3.61032 7.82902 3.80109 7.75 4 7.75H12C12.1989 7.75 12.3897 7.82902 12.5303 7.96967C12.671 8.11032 12.75 8.30109 12.75 8.5ZM14.5 4.75H1.5C1.30109 4.75 1.11032 4.82902 0.96967 4.96967C0.829018 5.11032 0.75 5.30109 0.75 5.5C0.75 5.69891 0.829018 5.88968 0.96967 6.03033C1.11032 6.17098 1.30109 6.25 1.5 6.25H14.5C14.6989 6.25 14.8897 6.17098 15.0303 6.03033C15.171 5.88968 15.25 5.69891 15.25 5.5C15.25 5.30109 15.171 5.11032 15.0303 4.96967C14.8897 4.82902 14.6989 4.75 14.5 4.75ZM9.5 10.75H6.5C6.30109 10.75 6.11032 10.829 5.96967 10.9697C5.82902 11.1103 5.75 11.3011 5.75 11.5C5.75 11.6989 5.82902 11.8897 5.96967 12.0303C6.11032 12.171 6.30109 12.25 6.5 12.25H9.5C9.69891 12.25 9.88968 12.171 10.0303 12.0303C10.171 11.8897 10.25 11.6989 10.25 11.5C10.25 11.3011 10.171 11.1103 10.0303 10.9697C9.88968 10.829 9.69891 10.75 9.5 10.75Z"
        fill={color}
      />
    </svg>
  );
}
