import { css } from "@emotion/css";
import type { TokenType } from "../../typings";

export const selectLoadingStyle = (token: TokenType) => css`
  padding: ${token.paddingSM}px;
  height: 80px;
`;
