import type { IconProps } from "../../types";

export function ArchivatorLegacy(props: IconProps): React.JSX.Element {
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
        d="M15.75 3.375H2.25C1.95163 3.375 1.66548 3.49353 1.4545 3.7045C1.24353 3.91548 1.125 4.20163 1.125 4.5V6.1875C1.125 6.48587 1.24353 6.77202 1.4545 6.98299C1.66548 7.19397 1.95163 7.3125 2.25 7.3125V13.5C2.25 13.7984 2.36853 14.0845 2.5795 14.2955C2.79048 14.5065 3.07663 14.625 3.375 14.625H14.625C14.9234 14.625 15.2095 14.5065 15.4205 14.2955C15.6315 14.0845 15.75 13.7984 15.75 13.5V7.3125C16.0484 7.3125 16.3345 7.19397 16.5455 6.98299C16.7565 6.77202 16.875 6.48587 16.875 6.1875V4.5C16.875 4.20163 16.7565 3.91548 16.5455 3.7045C16.3345 3.49353 16.0484 3.375 15.75 3.375ZM10.6875 10.125H7.3125C7.16332 10.125 7.02024 10.0657 6.91475 9.96025C6.80926 9.85476 6.75 9.71168 6.75 9.5625C6.75 9.41332 6.80926 9.27024 6.91475 9.16475C7.02024 9.05926 7.16332 9 7.3125 9H10.6875C10.8367 9 10.9798 9.05926 11.0852 9.16475C11.1907 9.27024 11.25 9.41332 11.25 9.5625C11.25 9.71168 11.1907 9.85476 11.0852 9.96025C10.9798 10.0657 10.8367 10.125 10.6875 10.125ZM15.75 6.1875H2.25V4.5H15.75V6.1875Z"
        fill={color}
      />
    </svg>
  );
}
