import type { IconProps } from "../../types";

export function Reload(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "#FFFFFF", ...rest } = props;

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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 3.00004C10.7614 3.00004 13 5.23862 13 8.00004C13 10.7615 10.7614 13 8 13C5.23858 13 3 10.7615 3 8.00004C3 7.25461 3.1628 6.54857 3.45431 5.91438C3.56963 5.66347 3.45973 5.36658 3.20882 5.25125C2.95792 5.13592 2.66102 5.24583 2.54569 5.49674C2.19519 6.25927 2 7.10755 2 8.00004C2 11.3138 4.68629 14 8 14C11.3137 14 14 11.3138 14 8.00004C14 4.68633 11.3137 2.00004 8 2.00004V3.00004Z"
        fill={color}
      />
      <path
        d="M8 4.46628V0.533803C8 0.321844 7.75279 0.206054 7.58995 0.341748L5.23047 2.30799C5.11053 2.40794 5.11053 2.59215 5.23047 2.6921L7.58995 4.65834C7.75279 4.79403 8 4.67824 8 4.46628Z"
        fill={color}
      />
    </svg>
  );
}
