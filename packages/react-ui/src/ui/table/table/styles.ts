import { css } from "@emotion/css";
import type { TokenType } from "../../../typings";

export const tableWrapperStyles = css`
  overflow: hidden;
`;

export const tableStyles = (token: TokenType, clickableRow?: boolean) => css`
  overflow: hidden;
  max-height: 100%;
  height: 100%;
  display: flex;

  .ant-spin-nested-loading {
    overflow: hidden;
    max-height: 100%;
    height: 100%;
  }

  .ant-spin-container {
    overflow: hidden;
    max-height: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-table {
    overflow: hidden;
    max-height: 100%;
    height: 100%;
    display: flex;
  }

  .ant-table-container {
    overflow: hidden !important;
    max-height: 100%;
    height: 100%;
    border-inline-start: 0 !important;
    display: flex;
    flex-direction: column;
  }

  .ant-table-body {
    height: calc(100% - 48px); // 48px - высота theader во всех таблицах
  }

  .ant-table-row {
    cursor: ${clickableRow ? "pointer" : "default"};
  }

  .ant-table-thead .ant-table-cell {
    font-weight: 400 !important;
    background-color: ${token.colorBgContainer};
  }

  td.ant-table-selection-column {
    padding: ${token.paddingMD}px 4px ${token.paddingMD}px 8px !important;
  }

  th {
    padding: ${token.paddingSM}px ${token.paddingMD}px !important;

    &.ant-table-selection-column {
      padding: ${token.paddingSM}px 4px ${token.paddingSM}px 8px !important;
    }
  }

  th,
  td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    & > span {
      font-size: ${token.fontSizeLG}px;
      line-height: ${token.lineHeightLG};
    }
  }

  /* td:last-child,
  th {
    border-inline-end: none !important;
  } */
`;
