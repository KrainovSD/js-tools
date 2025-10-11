import { Pagination as AntdPagination } from "antd";
import type { PaginationProps as AntdPaginationProps } from "antd";
import { type JSX } from "react";

export interface PaginationProps extends AntdPaginationProps {
  wide?: boolean;
}

export function Pagination(props: PaginationProps): JSX.Element {
  return <AntdPagination {...props} />;
}
