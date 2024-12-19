import { css } from "@emotion/css";

export const background = css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #8893a478;

  &.page {
    position: fixed;
  }
`;

export const text = css`
  position: absolute;
  font-size: 20px;
  font-weight: 600;
  color: "#1d1c2a";
  top: 50%;
  transform: translateY(200%);
`;
