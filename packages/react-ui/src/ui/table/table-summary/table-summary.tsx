import { Table as AntdTable, type GetProps } from "antd";
import type { JSX } from "react";

type TableSummaryProps = GetProps<typeof AntdTable.Summary>;

export function TableSummary(props: TableSummaryProps): JSX.Element {
  return <AntdTable.Summary {...props} />;
}
