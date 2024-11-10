import { css } from "@emotion/css";

export const inputStyles = (width: string | number) => css`
  width: ${typeof width === "number" ? `${width}px` : width} !important;
`;
