import { css } from "@emotion/css";
import type { GlobalToken } from "antd";

export const base = (token: GlobalToken, pagination: boolean) => css`
  z-index: 99;
  position: absolute;
  width: calc(100% - 32px);
  bottom: ${pagination ? 50 : 20}px;
  margin-left: 16px;
  left: 0;
  background-color: ${token.colorBgSpotlight};
  padding: 16px;
  border-radius: 8px;
  border-top: 1px solid ${token.colorSplit};
  box-shadow:
    0 0 8px 0 #fff,
    0 0 20px 0 #fff,
    0 0 20px 0 #fff;
`;
