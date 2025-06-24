/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
import type { ColumnOrderState, ExpandedState, RowSelectionState } from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
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
      expanded={expanded}
      onExpandedChange={setExpanded}
    />
  );
}
