import type { IconProps } from "../../types";

export function UploadLegacy(props: IconProps): React.JSX.Element {
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
        d="M14 9V13C14 13.1326 13.9473 13.2598 13.8536 13.3536C13.7598 13.4473 13.6326 13.5 13.5 13.5H2.5C2.36739 13.5 2.24021 13.4473 2.14645 13.3536C2.05268 13.2598 2 13.1326 2 13V9C2 8.86739 2.05268 8.74021 2.14645 8.64645C2.24021 8.55268 2.36739 8.5 2.5 8.5C2.63261 8.5 2.75979 8.55268 2.85355 8.64645C2.94732 8.74021 3 8.86739 3 9V12.5H13V9C13 8.86739 13.0527 8.74021 13.1464 8.64645C13.2402 8.55268 13.3674 8.5 13.5 8.5C13.6326 8.5 13.7598 8.55268 13.8536 8.64645C13.9473 8.74021 14 8.86739 14 9ZM7.64625 9.35375C7.69269 9.40024 7.74783 9.43712 7.80853 9.46228C7.86923 9.48744 7.93429 9.50039 8 9.50039C8.06571 9.50039 8.13077 9.48744 8.19147 9.46228C8.25217 9.43712 8.30731 9.40024 8.35375 9.35375L10.8538 6.85375C10.9238 6.78382 10.9714 6.6947 10.9908 6.59765C11.0101 6.50061 11.0002 6.40002 10.9623 6.3086C10.9244 6.21719 10.8603 6.13908 10.778 6.08414C10.6957 6.0292 10.5989 5.99992 10.5 6H8.5V2C8.5 1.86739 8.44732 1.74021 8.35355 1.64645C8.25979 1.55268 8.13261 1.5 8 1.5C7.86739 1.5 7.74021 1.55268 7.64645 1.64645C7.55268 1.74021 7.5 1.86739 7.5 2V6H5.5C5.40105 5.99992 5.30431 6.0292 5.22201 6.08414C5.13971 6.13908 5.07556 6.21719 5.03769 6.3086C4.99981 6.40002 4.98991 6.50061 5.00924 6.59765C5.02856 6.6947 5.07624 6.78382 5.14625 6.85375L7.64625 9.35375Z"
        fill={color}
      />
    </svg>
  );
}
