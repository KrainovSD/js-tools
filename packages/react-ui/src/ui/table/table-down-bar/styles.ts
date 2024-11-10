import { css } from "@emotion/css";
import type { TokenType } from "../../../typings";

export const downBarContainerStyles = (token: TokenType) => css`
  z-index: 99;
  position: sticky;
  width: calc(100% - 32px);
  bottom: 32px;
  margin-left: 16px;
  background-color: ${token.colorBgSpotlight};
  padding: 16px;
  border-radius: 8px;
  border-top: 1px solid ${token.colorSplit};
  box-shadow:
    0 0 8px 0 #fff,
    0 0 20px 0 #fff,
    0 0 20px 0 #fff;
`;
