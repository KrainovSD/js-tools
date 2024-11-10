import { css } from "@emotion/css";
import type { TokenType } from "../../typings";

export const primaryAppearanceStyles = (token: TokenType) => css`
  padding: 1px ${token.controlPaddingHorizontalSM}px;
  color: ${token.colorPrimaryTextHover} !important;
  background-color: ${token.colorPrimaryBg};
  border: none;
`;

export const secondaryAppearanceStyles = (token: TokenType) => css`
  padding: ${token.paddingXXS}px ${token.paddingSM}px;
  color: ${token.colorText};
  border: none;
`;

export const fontStyles = (token: TokenType, isLarge?: boolean) => css`
  font-size: ${isLarge ? token.fontSizeLG : token.fontSize}px;
  line-height: ${isLarge ? token.lineHeightLG : token.lineHeight};
`;

export const baseStyles = css`
  margin-inline-end: 0 !important;
`;
