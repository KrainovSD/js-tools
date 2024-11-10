import { css } from "@emotion/css";

export const imageStyles = (size?: number) => css`
  width: ${size ? `${size}px` : "auto"} !important;
  height: ${size ? `${size}px` : "auto"} !important;

  .ant-skeleton-image-svg {
    width: ${size ? `calc(${size}px / 2)` : "auto"} !important;
  }
`;
