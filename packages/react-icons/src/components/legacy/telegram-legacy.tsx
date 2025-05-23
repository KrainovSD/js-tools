import type { IconProps } from "../../types";

export function TelegramLegacy(props: IconProps): React.JSX.Element {
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
        d="M16.2703 3.11801C16.2703 3.11801 16.2703 3.12504 16.2703 3.12855L12.1781 16.6243C12.1161 16.8435 11.9886 17.0385 11.8127 17.1832C11.6367 17.3279 11.4207 17.4152 11.1937 17.4336C11.1613 17.4364 11.129 17.4378 11.0967 17.4378C10.8839 17.4385 10.6754 17.3783 10.4957 17.2643C10.3161 17.1503 10.1728 16.9873 10.0828 16.7945L7.52338 11.5421C7.49777 11.4895 7.48922 11.4302 7.49893 11.3725C7.50863 11.3147 7.53611 11.2615 7.57752 11.2201L11.65 7.14762C11.7511 7.04127 11.8066 6.89966 11.8047 6.75298C11.8028 6.6063 11.7437 6.46616 11.64 6.36243C11.5362 6.25871 11.3961 6.19961 11.2494 6.19773C11.1027 6.19585 10.9611 6.25134 10.8548 6.35238L6.78018 10.4249C6.73881 10.4663 6.68555 10.4938 6.62782 10.5035C6.5701 10.5132 6.51078 10.5046 6.45814 10.479L1.20088 7.92035C0.9953 7.82172 0.824542 7.66295 0.711235 7.46508C0.597928 7.26722 0.547422 7.03959 0.566408 6.81236C0.585394 6.58514 0.672976 6.36905 0.81755 6.19273C0.962123 6.01641 1.15686 5.88818 1.37596 5.82504L14.8717 1.73285H14.8823C15.0744 1.67887 15.2775 1.67697 15.4706 1.72737C15.6637 1.77776 15.84 1.87863 15.9813 2.01962C16.1225 2.16061 16.2238 2.33664 16.2745 2.52966C16.3253 2.72269 16.3238 2.92575 16.2703 3.11801Z"
        fill={color}
      />
    </svg>
  );
}
