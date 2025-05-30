import type { IconProps } from "../../types";

export function BrokerArrowLegacy(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 18 18"
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
        d="M16.307 7.4207C16.3053 7.65839 16.2272 7.88923 16.0843 8.07915C15.9413 8.26906 15.7411 8.40798 15.5132 8.47539L15.4991 8.47961L10.0147 10.0152L8.4791 15.4996L8.47488 15.5137C8.40737 15.7415 8.26842 15.9417 8.07853 16.0846C7.88864 16.2276 7.65785 16.3057 7.42019 16.3075H7.3991C7.16604 16.3097 6.93822 16.2384 6.74801 16.1037C6.55779 15.969 6.41485 15.7778 6.33949 15.5573L1.7523 3.19C1.75082 3.18635 1.74964 3.18259 1.74879 3.17875C1.68023 2.97965 1.66894 2.7653 1.71618 2.5601C1.76342 2.35489 1.86731 2.16706 2.01603 2.01798C2.16474 1.8689 2.35231 1.76455 2.5574 1.7168C2.76249 1.66906 2.97686 1.67983 3.17613 1.74789L3.18738 1.7514L15.5568 6.34C15.7807 6.41655 15.9743 6.56273 16.1093 6.75716C16.2443 6.9516 16.3136 7.1841 16.307 7.4207Z"
        fill={color}
      />
    </svg>
  );
}
