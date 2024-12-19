import type { IconProps } from "../../types";

export function Source(props: IconProps): React.JSX.Element {
  const { sizeX = 14, sizeY = 14, color = "#FFFFFF", ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeX}
      height={sizeY}
      viewBox="0 0 16 16"
      fill="none"
      {...rest}
    >
      <path
        d="M8.00003 8.5V12.5C8.00011 12.5989 7.97083 12.6957 7.91589 12.778C7.86096 12.8603 7.78284 12.9244 7.69143 12.9623C7.60002 13.0002 7.49942 13.0101 7.40238 12.9908C7.30534 12.9714 7.21621 12.9238 7.14628 12.8538L5.50003 11.2069L2.85378 13.8538C2.80733 13.9002 2.75218 13.9371 2.69148 13.9622C2.63079 13.9873 2.56573 14.0003 2.50003 14.0003C2.43434 14.0003 2.36928 13.9873 2.30859 13.9622C2.24789 13.9371 2.19274 13.9002 2.14628 13.8538C2.09983 13.8073 2.06298 13.7521 2.03784 13.6914C2.0127 13.6308 1.99976 13.5657 1.99976 13.5C1.99976 13.4343 2.0127 13.3692 2.03784 13.3086C2.06298 13.2479 2.09983 13.1927 2.14628 13.1462L4.79316 10.5L3.14628 8.85375C3.07628 8.78382 3.02859 8.6947 3.00927 8.59765C2.98994 8.50061 2.99985 8.40002 3.03772 8.30861C3.0756 8.21719 3.13975 8.13908 3.22204 8.08414C3.30434 8.0292 3.40109 7.99992 3.50003 8H7.50003C7.63264 8 7.75982 8.05268 7.85359 8.14645C7.94736 8.24021 8.00003 8.36739 8.00003 8.5ZM13 2H5.00003C4.73482 2 4.48046 2.10536 4.29293 2.29289C4.10539 2.48043 4.00003 2.73478 4.00003 3V6C4.00003 6.13261 4.05271 6.25979 4.14648 6.35355C4.24025 6.44732 4.36743 6.5 4.50003 6.5C4.63264 6.5 4.75982 6.44732 4.85359 6.35355C4.94736 6.25979 5.00003 6.13261 5.00003 6V3H13V11H10C9.86743 11 9.74025 11.0527 9.64648 11.1464C9.55271 11.2402 9.50003 11.3674 9.50003 11.5C9.50003 11.6326 9.55271 11.7598 9.64648 11.8536C9.74025 11.9473 9.86743 12 10 12H13C13.2653 12 13.5196 11.8946 13.7071 11.7071C13.8947 11.5196 14 11.2652 14 11V3C14 2.73478 13.8947 2.48043 13.7071 2.29289C13.5196 2.10536 13.2653 2 13 2Z"
        fill={color}
      />
    </svg>
  );
}