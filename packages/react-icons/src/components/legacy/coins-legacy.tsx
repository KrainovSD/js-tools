import type { IconProps } from "../../types";

export function CoinsLegacy(props: IconProps): React.JSX.Element {
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
        d="M11.5 5.59812V5.25C11.5 3.6825 9.13562 2.5 6 2.5C2.86438 2.5 0.5 3.6825 0.5 5.25V7.75C0.5 9.05562 2.14062 10.0931 4.5 10.4038V10.75C4.5 12.3175 6.86438 13.5 10 13.5C13.1356 13.5 15.5 12.3175 15.5 10.75V8.25C15.5 6.95625 13.9113 5.9175 11.5 5.59812ZM3.5 9.17937C2.27562 8.8375 1.5 8.27437 1.5 7.75V6.87063C2.01 7.23187 2.69313 7.52313 3.5 7.71875V9.17937ZM8.5 7.71875C9.30688 7.52313 9.99 7.23187 10.5 6.87063V7.75C10.5 8.27437 9.72437 8.8375 8.5 9.17937V7.71875ZM7.5 12.1794C6.27563 11.8375 5.5 11.2744 5.5 10.75V10.4894C5.66437 10.4956 5.83063 10.5 6 10.5C6.2425 10.5 6.47937 10.4919 6.71187 10.4781C6.97016 10.5706 7.23325 10.649 7.5 10.7131V12.1794ZM7.5 9.39062C7.00338 9.46399 6.50201 9.50055 6 9.5C5.49799 9.50055 4.99662 9.46399 4.5 9.39062V7.90375C4.99736 7.96856 5.49843 8.00071 6 8C6.50157 8.00071 7.00264 7.96856 7.5 7.90375V9.39062ZM11.5 12.3906C10.5053 12.5365 9.49468 12.5365 8.5 12.3906V10.9C8.9972 10.9668 9.49833 11.0002 10 11C10.5016 11.0007 11.0026 10.9686 11.5 10.9038V12.3906ZM14.5 10.75C14.5 11.2744 13.7244 11.8375 12.5 12.1794V10.7188C13.3069 10.5231 13.99 10.2319 14.5 9.87062V10.75Z"
        fill={color}
      />
    </svg>
  );
}
