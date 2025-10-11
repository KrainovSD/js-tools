import type { IconProps } from "../../types";

export function ReportsLegacy(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={sizeY}
      viewBox="0 0 20 20"
      width={sizeX}
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
        d="M6.875 1.875C6.54348 1.875 6.22554 2.0067 5.99112 2.24112C5.7567 2.47554 5.625 2.79348 5.625 3.125V4.375H4.375C4.04348 4.375 3.72554 4.5067 3.49112 4.74112C3.2567 4.97554 3.125 5.29348 3.125 5.625V16.875C3.125 17.2065 3.2567 17.5245 3.49112 17.7589C3.72554 17.9933 4.04348 18.125 4.375 18.125H13.125C13.4565 18.125 13.7745 17.9933 14.0089 17.7589C14.2433 17.5245 14.375 17.2065 14.375 16.875V15.625H15.625C15.9565 15.625 16.2745 15.4933 16.5089 15.2589C16.7433 15.0245 16.875 14.7065 16.875 14.375V5.625C16.875 5.45924 16.8092 5.30027 16.6919 5.18306L13.5669 2.05806C13.4497 1.94085 13.2908 1.875 13.125 1.875H6.875ZM14.375 14.375H15.625V5.88388L12.8661 3.125L6.875 3.125V4.375H10.625C10.7908 4.375 10.9497 4.44085 11.0669 4.55806L14.1919 7.68306C14.3092 7.80027 14.375 7.95924 14.375 8.125V14.375ZM6.25 5.625H4.375L4.375 16.875H13.125V15V8.38388L10.3661 5.625H6.25ZM6.25 11.875C6.25 11.5298 6.52982 11.25 6.875 11.25H10.625C10.9702 11.25 11.25 11.5298 11.25 11.875C11.25 12.2202 10.9702 12.5 10.625 12.5H6.875C6.52982 12.5 6.25 12.2202 6.25 11.875ZM6.875 13.75C6.52982 13.75 6.25 14.0298 6.25 14.375C6.25 14.7202 6.52982 15 6.875 15H10.625C10.9702 15 11.25 14.7202 11.25 14.375C11.25 14.0298 10.9702 13.75 10.625 13.75H6.875Z"
        fill={color}
      />
    </svg>
  );
}
