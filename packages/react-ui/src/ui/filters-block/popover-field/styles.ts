import { css } from "@emotion/css";
import type { TokenType } from "../../../typings";

export const PopoverElementStyles = (token: TokenType) => css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  vertical-align: middle;
  padding: 5px 20px;
  border: 1px solid ${token.colorBorderSecondary};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    border-color: ${token.colorPrimary};
  }
`;
