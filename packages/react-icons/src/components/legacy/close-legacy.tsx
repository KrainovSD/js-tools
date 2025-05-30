import type { IconProps } from "../../types";

export function CloseLegacy(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 13 12"
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
        d="M1.01229 1.17521C0.829235 0.992148 0.829235 0.695352 1.01229 0.512294C1.19535 0.329235 1.49215 0.329235 1.67521 0.512294L6.5 5.33709L11.3248 0.512294C11.5079 0.329235 11.8046 0.329235 11.9877 0.512294C12.1708 0.695352 12.1708 0.992148 11.9877 1.17521L7.16291 6L11.9877 10.8248C12.1708 11.0079 12.1708 11.3046 11.9877 11.4877C11.8046 11.6708 11.5079 11.6708 11.3248 11.4877L6.5 6.66291L1.67521 11.4877C1.49215 11.6708 1.19535 11.6708 1.01229 11.4877C0.829236 11.3046 0.829236 11.0079 1.01229 10.8248L5.83709 6L1.01229 1.17521Z"
        fill={color}
      />
    </svg>
  );
}
