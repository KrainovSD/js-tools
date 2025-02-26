import type { IconProps } from "../../types";

export function Offers(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={sizeY}
      width={sizeX}
      viewBox="0 0 20 20"
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.1251 1.875C7.62782 1.875 7.15091 2.07254 6.79928 2.42417C6.44765 2.77581 6.2501 3.25272 6.2501 3.75V4.375H3.1251C2.43475 4.375 1.8751 4.93464 1.8751 5.625V9.23177C1.87497 9.23937 1.87497 9.24696 1.8751 9.25455V15.625C1.8751 16.3154 2.43475 16.875 3.1251 16.875H16.8751C17.5655 16.875 18.1251 16.3154 18.1251 15.625V9.25378C18.1252 9.24619 18.1252 9.23858 18.1251 9.23097V5.625C18.1251 4.93464 17.5655 4.375 16.8751 4.375H13.7501V3.75C13.7501 3.25272 13.5526 2.77581 13.2009 2.42417C12.8493 2.07254 12.3724 1.875 11.8751 1.875H8.1251ZM3.1251 15.625V10.2853C5.26051 11.3327 7.61226 11.8786 10.0001 11.875C12.388 11.8786 14.7398 11.3324 16.8751 10.2847V15.625H3.1251ZM10.0011 10.625C12.4047 10.6288 14.7685 10.0268 16.8751 8.87733V5.625H13.1251H6.8751H3.1251V8.87804C5.2318 10.0271 7.59558 10.6288 9.99911 10.625H10.0011ZM12.5001 4.375V3.75C12.5001 3.58424 12.4343 3.42527 12.317 3.30806C12.1998 3.19085 12.0409 3.125 11.8751 3.125H8.1251C7.95934 3.125 7.80037 3.19085 7.68316 3.30806C7.56595 3.42527 7.5001 3.58424 7.5001 3.75V4.375H12.5001ZM8.7501 8.125C8.40493 8.125 8.1251 8.40482 8.1251 8.75C8.1251 9.09518 8.40493 9.375 8.7501 9.375H11.2501C11.5953 9.375 11.8751 9.09518 11.8751 8.75C11.8751 8.40482 11.5953 8.125 11.2501 8.125H8.7501Z"
        fill={color}
      />
    </svg>
  );
}
