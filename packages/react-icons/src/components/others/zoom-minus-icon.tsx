import type { IconProps } from "../../types";

export function ZoomMinus(props: IconProps): React.JSX.Element {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.75 18C14.3063 18 18 14.3063 18 9.75C18 5.19365 14.3063 1.5 9.75 1.5C5.19365 1.5 1.5 5.19365 1.5 9.75C1.5 14.3063 5.19365 18 9.75 18ZM19.5 9.75C19.5 15.1348 15.1348 19.5 9.75 19.5C4.36522 19.5 0 15.1348 0 9.75C0 4.36522 4.36522 0 9.75 0C15.1348 0 19.5 4.36522 19.5 9.75Z"
        fill={color}
      />
      <path
        d="M15.5158 17.6132C15.5601 17.6732 15.6093 17.7307 15.6636 17.785L21.4393 23.5607C22.0251 24.1465 22.9749 24.1465 23.5607 23.5607C24.1465 22.9749 24.1465 22.0251 23.5607 21.4393L17.785 15.6636C17.7307 15.6093 17.6732 15.5601 17.6132 15.5158C17.0248 16.3169 16.3169 17.0248 15.5158 17.6132Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 9.75C4.5 9.33579 4.83579 9 5.25 9H14.25C14.6642 9 15 9.33579 15 9.75C15 10.1642 14.6642 10.5 14.25 10.5H5.25C4.83579 10.5 4.5 10.1642 4.5 9.75Z"
        fill={color}
      />
    </svg>
  );
}
