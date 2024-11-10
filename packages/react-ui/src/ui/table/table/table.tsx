import { Table as AntdTable, Empty, theme } from "antd";
import type { TableProps as AntdTableProps } from "antd";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { TableDownBar } from "../table-down-bar";
import { tableStyles, tableWrapperStyles } from "./styles";

export interface TableProps extends AntdTableProps {
  downBar?: ReactNode;
}

export function Table(props: TableProps): React.JSX.Element {
  const { className, onRow, downBar, pagination = false, ...otherProps } = props;
  const { token } = theme.useToken();
  const { t } = useTranslation();

  const empty = {
    emptyText: (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("common.table.emptyText")} />
    ),
  };

  return (
    <div className={tableWrapperStyles}>
      <AntdTable
        pagination={pagination}
        locale={empty}
        onRow={onRow}
        className={clsx(tableStyles(token, Boolean(onRow)), className)}
        {...otherProps}
      />
      {downBar && <TableDownBar>{downBar}</TableDownBar>}
    </div>
  );
}
