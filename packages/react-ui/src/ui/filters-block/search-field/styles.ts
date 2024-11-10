import { css, keyframes } from "@emotion/css";

const dropdown = keyframes`
  from { width: 0; padding: 0 };
  to { width: 230px };
`;

const dropdownBack = keyframes`
  from { width: 230px };
  to { width: 0; padding: 0 };  
`;

export const inputSearchDefault = css`
  display: none;
`;

export const inputSearchHide = css`
  animation: ${dropdownBack} 0.5s forwards;
`;

export const inputSearchShow = css`
  border: none;
  outline: none;
  padding: 4px;
  animation: ${dropdown} 0.5s forwards;
`;

export const searchButton = css`
  outline: none;
  border: none;
  box-shadow: none;
`;

export const closeButtonHide = css`
  visibility: hidden;
  height: 16px;
  width: 16px !important;
`;

export const closeButtonShow = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  box-shadow: none;
  height: 16px;
  width: 16px !important;
`;
