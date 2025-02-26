import type { IconProps } from "../../types";

export function Cycle(props: IconProps): React.JSX.Element {
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
        d="M11.5337 7H15.4662C15.6781 7 15.7939 7.24721 15.6582 7.41005L13.692 9.76953C13.592 9.88947 13.4078 9.88947 13.3079 9.76953L11.3416 7.41005C11.2059 7.24721 11.3217 7 11.5337 7Z"
        fill={color}
      />
      <path
        d="M0.533681 9H4.46616C4.67812 9 4.79391 8.75279 4.65822 8.58995L2.69198 6.23047C2.59203 6.11053 2.40781 6.11053 2.30787 6.23047L0.341625 8.58995C0.205932 8.75279 0.321722 9 0.533681 9Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.99992 3C6.44743 3 5.06049 3.70697 4.14261 4.81839C3.96677 5.03131 3.65161 5.06137 3.43869 4.88552C3.22578 4.70968 3.19572 4.39453 3.37156 4.18161C4.47126 2.85003 6.13654 2 7.99992 2C10.9416 2 13.3879 4.1165 13.901 6.90967C13.9065 6.9397 13.9118 6.96981 13.9169 7H12.9C12.437 4.71778 10.4185 3 7.99992 3ZM3.09984 9C3.56285 11.2822 5.58129 13 7.99992 13C9.55241 13 10.9394 12.293 11.8572 11.1816C12.0331 10.9687 12.3482 10.9386 12.5611 11.1145C12.7741 11.2903 12.8041 11.6055 12.6283 11.8184C11.5286 13.15 9.8633 14 7.99992 14C5.05822 14 2.6119 11.8835 2.09884 9.09033C2.09332 9.0603 2.08803 9.03019 2.08296 9H3.09984Z"
        fill={color}
      />
    </svg>
  );
}
