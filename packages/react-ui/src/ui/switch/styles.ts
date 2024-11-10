import { css } from "@emotion/css";

export const styles = {
  bgColor: (color: string) => css`
    background: ${color} !important;
  `,
  bgColorActive: (color: string) => css`
    &.ant-switch-checked {
      background: ${color} !important;
    }
  `,
};
