/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
import type { ColumnOrderState, ExpandedState, RowSelectionState } from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type { RowInterface } from "../../types";
import { COMMON_COLUMNS, COMMON_COLUMNS_VIRTUAL } from "../lib/common/columns";
import { COMMON_ROW_VIRTUAL } from "../lib/common/rows";
import type {
  CellClassKeys,
  CellRenderKeys,
  CommonRowVirtual,
  FilterRenderKeys,
  FilterTypeKeys,
  HeaderClassKeys,
  HeaderRenderKeys,
  SortRenderKeys,
  SortTypeKeys,
} from "../types/common";
import styles from "./styles.module.scss";

export function CommonVirtual() {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [tableColumns, setTableColumns] = React.useState<ColumnOrderState>(
    COMMON_COLUMNS.map((col) => col.key),
  );

  function onClick(row: RowInterface<CommonRowVirtual>) {
    console.log(row, "click");
  }
  function onDoubleClick(row: RowInterface<CommonRowVirtual>) {
    console.log(row, "dbClick");
  }

  return (
    <Table<
      CommonRowVirtual,
      Record<string, unknown>,
      CellRenderKeys,
      HeaderRenderKeys,
      FilterRenderKeys,
      SortRenderKeys,
      CellClassKeys,
      HeaderClassKeys,
      FilterTypeKeys,
      SortTypeKeys
    >
      columns={COMMON_COLUMNS_VIRTUAL}
      rows={COMMON_ROW_VIRTUAL}
      // rows={[]}
      Empty={() => <span>Empty</span>}
      cellRenders={{ test: () => "" }}
      getSubRows={(row) => row.children}
      withPagination
      withTotal
      initialPageSize={150}
      onClickRow={onClick}
      onDoubleClickRow={onDoubleClick}
      pageSizes={[25, 50, 100, 150, 250, 500]}
      withFilters={true}
      virtualRows={true}
      virtualRowSize={69}
      virtualColumn={true}
      fullSize={true}
      loading={false}
      columnOrder={tableColumns}
      onColumnOrderChange={setTableColumns}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={(row) => row.id}
      expanded={expanded}
      onExpandedChange={setExpanded}
      rowClassName={styles.row}
      headerRowClassName={styles.headerRow}
    />
  );
}
