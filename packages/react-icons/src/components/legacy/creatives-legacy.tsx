import type { IconProps } from "../../types";

export function CreativesLegacy(props: IconProps): React.JSX.Element {
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
        d="M13.5 2.5H4.5C4.23478 2.5 3.98043 2.60536 3.79289 2.79289C3.60536 2.98043 3.5 3.23478 3.5 3.5V4.5H2.5C2.23478 4.5 1.98043 4.60536 1.79289 4.79289C1.60536 4.98043 1.5 5.23478 1.5 5.5V12.5C1.5 12.7652 1.60536 13.0196 1.79289 13.2071C1.98043 13.3946 2.23478 13.5 2.5 13.5H11.5C11.7652 13.5 12.0196 13.3946 12.2071 13.2071C12.3946 13.0196 12.5 12.7652 12.5 12.5V11.5H13.5C13.7652 11.5 14.0196 11.3946 14.2071 11.2071C14.3946 11.0196 14.5 10.7652 14.5 10.5V3.5C14.5 3.23478 14.3946 2.98043 14.2071 2.79289C14.0196 2.60536 13.7652 2.5 13.5 2.5ZM10.75 4.5C10.8983 4.5 11.0433 4.54399 11.1667 4.6264C11.29 4.70881 11.3861 4.82594 11.4429 4.96299C11.4997 5.10003 11.5145 5.25083 11.4856 5.39632C11.4566 5.5418 11.3852 5.67544 11.2803 5.78033C11.1754 5.88522 11.0418 5.95665 10.8963 5.98559C10.7508 6.01453 10.6 5.99968 10.463 5.94291C10.3259 5.88614 10.2088 5.79001 10.1264 5.66668C10.044 5.54334 10 5.39834 10 5.25C10 5.05109 10.079 4.86032 10.2197 4.71967C10.3603 4.57902 10.5511 4.5 10.75 4.5ZM11.5 12.5H2.5V5.5H3.5V10.5C3.5 10.7652 3.60536 11.0196 3.79289 11.2071C3.98043 11.3946 4.23478 11.5 4.5 11.5H11.5V12.5ZM13.5 10.5H4.5V7.54313L6.39625 5.64625C6.44269 5.59976 6.49783 5.56288 6.55853 5.53772C6.61923 5.51256 6.68429 5.49961 6.75 5.49961C6.81571 5.49961 6.88077 5.51256 6.94147 5.53772C7.00217 5.56288 7.05731 5.59976 7.10375 5.64625L10.2069 8.75L11.8125 7.14625C11.9063 7.05255 12.0334 6.99992 12.1659 6.99992C12.2985 6.99992 12.4256 7.05255 12.5194 7.14625L13.5 8.12938V10.5Z"
        fill={color}
      />
    </svg>
  );
}
