import { css, keyframes } from "@emotion/css";

const dropdown = keyframes`
  from { width: 0; padding: 4px;};
  to { width: 230px };
`;

const dropdownBack = keyframes`
  from { width: 230px };
  to { width: 0; padding: 0; border-color: transparent  };  
`;

export const input = css`
  padding: 4px;

  &.showing {
    animation: ${dropdown} 0.5s forwards;
  }
  &.hiding {
    animation: ${dropdownBack} 0.5s forwards;
  }
  &.hide {
    display: none;
  }
`;

export const container = css`
  height: 32px;
  min-height: 32px;
`;
