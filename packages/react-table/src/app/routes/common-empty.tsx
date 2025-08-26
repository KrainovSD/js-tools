/* eslint-disable no-console */
import type { ColumnOrderState, ExpandedState, RowSelectionState } from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type { RowInterface } from "../../types";
import {
  type CELL_CLASSES,
  type CELL_RENDERS,
  COMMON_COLUMNS,
  type FILTER_RENDERS,
  type FILTER_TYPES,
  type HEADER_CLASSES,
  type HEADER_RENDERS,
  type SORT_RENDERS,
  type SORT_TYPES,
} from "../lib/common/columns";
import type { CommonRow } from "../types/common";

export function CommonEmpty() {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [tableColumns, setTableColumns] = React.useState<ColumnOrderState>(
    COMMON_COLUMNS.map((col) => col.id ?? col.key),
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
      typeof CELL_RENDERS,
      typeof HEADER_RENDERS,
      typeof FILTER_RENDERS,
      typeof SORT_RENDERS,
      typeof CELL_CLASSES,
      typeof HEADER_CLASSES,
      typeof FILTER_TYPES,
      typeof SORT_TYPES
    >
      columns={COMMON_COLUMNS}
      rows={[]}
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
      fullSize={false}
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
