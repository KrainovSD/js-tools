import { Table as AntdTable, Empty, theme } from "antd";
import type { TableProps as AntdTableProps } from "antd";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import React from "react";
import { TableDownBar } from "../table-down-bar";
import * as styles from "./styles";

export interface TableProps<R extends Record<string, unknown>> extends AntdTableProps {
  downBar?: ReactNode;
  emptyLabel?: string;
  selectedRows?: string[];
  setSelectedRows?: (rows: R[]) => void;
}

export function Table<R extends Record<string, unknown>>(props: TableProps<R>): React.JSX.Element {
  const {
    className,
    onRow,
    downBar,
    pagination = false,
    emptyLabel,
    selectedRows,
    setSelectedRows,
    ...otherProps
  } = props;
  const { token } = theme.useToken();

  const empty = {
    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyLabel} />,
  };

  const onSelectRow = React.useMemo<TableProps<R>["rowSelection"] | undefined>(() => {
    if (!selectedRows || !setSelectedRows) return undefined;

    return {
      fixed: "left",
      selectedRowKeys: selectedRows,
      onChange: (_: unknown, rows: R[]) => {
        setSelectedRows(rows);
      },
      columnWidth: 32,
    };
  }, [selectedRows, setSelectedRows]);

  return (
    <div className={clsx(styles.container, Boolean(pagination) && "pagination")}>
      <AntdTable
        rowSelection={onSelectRow}
        pagination={pagination}
        locale={empty}
        onRow={onRow}
        className={clsx(
          styles.table(token, Boolean(onRow)),

          className,
        )}
        scroll={{ x: "100%", y: "100%" }}
        {...otherProps}
      />
      {downBar && <TableDownBar pagination={Boolean(pagination)}>{downBar}</TableDownBar>}
    </div>
  );
}
