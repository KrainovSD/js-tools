import type { IconProps } from "../../types";

export function Circle(props: IconProps): React.JSX.Element {
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
        d="M8 1.5C6.71442 1.5 5.45771 1.88122 4.38879 2.59545C3.31987 3.30968 2.48675 4.32484 1.99478 5.51256C1.50281 6.70028 1.37409 8.00721 1.62489 9.26809C1.8757 10.529 2.49476 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73191 14.3751C7.99279 14.6259 9.29972 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4982 6.27665 13.8128 4.62441 12.5942 3.40582C11.3756 2.18722 9.72335 1.50182 8 1.5ZM8 13.5C6.9122 13.5 5.84883 13.1774 4.94436 12.5731C4.03989 11.9687 3.33494 11.1098 2.91866 10.1048C2.50238 9.09977 2.39346 7.9939 2.60568 6.927C2.8179 5.86011 3.34172 4.8801 4.11091 4.11091C4.8801 3.34172 5.86011 2.8179 6.927 2.60568C7.9939 2.39346 9.09976 2.50238 10.1048 2.91866C11.1098 3.33494 11.9687 4.03989 12.5731 4.94436C13.1774 5.84883 13.5 6.9122 13.5 8C13.4983 9.45818 12.9184 10.8562 11.8873 11.8873C10.8562 12.9184 9.45818 13.4983 8 13.5Z"
        fill={color}
      />
    </svg>
  );
}
