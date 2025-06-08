/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
/* eslint-disable no-console */
import type { ColumnOrderState, ExpandedState, RowSelectionState } from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type { RowInterface } from "../../types";
import { COMMON_COLUMNS } from "../lib/common/columns";
import { COMMON_ROW } from "../lib/common/rows";
import type {
  CellClassKeys,
  CellRenderKeys,
  CommonRow,
  FilterRenderKeys,
  FilterTypeKeys,
  HeaderClassKeys,
  HeaderRenderKeys,
  SortRenderKeys,
  SortTypeKeys,
} from "../types/common";

export function Common() {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [tableColumns, setTableColumns] = React.useState<ColumnOrderState>(
    COMMON_COLUMNS.map((col) => col.key),
  );

  function onClick(row: RowInterface<CommonRow>) {
    console.log(row, "click");
  }
  function onDoubleClick(row: RowInterface<CommonRow>) {
    console.log(row, "dbClick");
  }

  return (
    <Table<
      CommonRow,
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
      columns={COMMON_COLUMNS}
      rows={COMMON_ROW}
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
      virtualRows={false}
      virtualRowSize={69}
      virtualColumn={false}
      fullSize={true}
      loading={false}
      columnOrder={tableColumns}
      onColumnOrderChange={setTableColumns}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={(row) => row.id}
      expanded={expanded}
      onExpandedChange={setExpanded}
    />
  );
}
