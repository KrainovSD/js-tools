import type { IconProps } from "../../types";

export function CalendarAccess(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 64 64"
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
        d="M43.2639 32.578C44.0346 33.3488 44.0346 34.5985 43.2639 35.3693L31.4218 47.2114C31.0516 47.5815 30.5496 47.7894 30.0262 47.7894C29.5027 47.7894 29.0007 47.5815 28.6306 47.2114L22.7095 41.2903C21.9387 40.5195 21.9387 39.2699 22.7095 38.4991C23.4803 37.7283 24.7299 37.7283 25.5007 38.4991L30.0262 43.0245L40.4727 32.578C41.2434 31.8073 42.4931 31.8073 43.2639 32.578Z"
        fill={color}
      />
      <path
        d="M14.2367 0.421021C15.3267 0.421021 16.2104 1.30467 16.2104 2.3947V4.36839H47.7893V2.3947C47.7893 1.30467 48.673 0.421021 49.763 0.421021C50.853 0.421021 51.7367 1.30467 51.7367 2.3947V4.36839H55.6841C60.0442 4.36839 63.5788 7.90298 63.5788 12.2631V55.6842C63.5788 60.0443 60.0442 63.5789 55.6841 63.5789H8.31564C3.9555 63.5789 0.420898 60.0443 0.420898 55.6842V12.2631C0.420898 7.90298 3.95549 4.36839 8.31564 4.36839H12.263V2.3947C12.263 1.30467 13.1467 0.421021 14.2367 0.421021ZM8.31564 8.31576C6.13556 8.31576 4.36827 10.0831 4.36827 12.2631V55.6842C4.36827 57.8643 6.13557 59.6315 8.31564 59.6315H55.6841C57.8641 59.6315 59.6314 57.8643 59.6314 55.6842V12.2631C59.6314 10.0831 57.8641 8.31576 55.6841 8.31576H8.31564Z"
        fill={color}
      />
      <path
        d="M10.2893 16.2105C10.2893 15.1205 11.173 14.2368 12.263 14.2368H51.7367C52.8267 14.2368 53.7104 15.1205 53.7104 16.2105V20.1579C53.7104 21.2479 52.8267 22.1315 51.7367 22.1315H12.263C11.173 22.1315 10.2893 21.2479 10.2893 20.1579V16.2105Z"
        fill={color}
      />
    </svg>
  );
}
