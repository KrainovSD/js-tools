import { css } from "@emotion/css";
import type { GlobalToken } from "antd";

export const popover = (token: GlobalToken) => css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  vertical-align: middle;
  padding: 3px 8px;
  border: 1px solid ${token.colorBorder};
  border-radius: ${token.borderRadius}px;
  background: ${token.Button?.defaultBg};
  color: ${token.colorTextBase};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    border-color: ${token.colorPrimary};
    color: ${token.colorPrimary};
  }
`;
