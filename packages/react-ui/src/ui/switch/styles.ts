import { css } from "@emotion/css";

export const background = (offColor?: string, activeColor?: string) => css`
  &.off-custom-color {
    background: ${offColor} !important;
  }
  &.active-custom-color {
    &.ant-switch-checked {
      background: ${activeColor} !important;
    }
  }
`;
