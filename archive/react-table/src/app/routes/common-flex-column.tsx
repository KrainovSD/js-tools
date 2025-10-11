/* eslint-disable no-console */
import type {
  ColumnOrderState,
  ColumnSizingState,
  ExpandedState,
  RowSelectionState,
} from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type { RowInterface } from "../../types";
import {
  type CELL_CLASSES,
  type CELL_RENDERS,
  type FILTER_RENDERS,
  type FILTER_TYPES,
  type HEADER_CLASSES,
  type HEADER_RENDERS,
  type SORT_RENDERS,
  type SORT_TYPES,
} from "../lib/common/columns";
import { COMMON_ROW } from "../lib/common/rows";
import type { Column, CommonRow } from "../types/common";

const COMMON_COLUMNS: Column[] = [
  {
    id: "select",
    key: "id",
    name: "",
    sortable: false,
    width: 100,
    additionalCellClass: ["hCenter", "wCenter"],
    cellRender: {
      component: "select",
      props: { hover: true },
    },
    additionalHeaderClass: ["hCenter", "wCenter"],
    headerRender: {
      component: "select",
    },
    expandable: true,
    expandedShift: 10,
    leftFrozen: true,
  },
  {
    key: "firstName",
    name: "firstName",
    minWidth: 250,
  },
  {
    key: "age",
    name: "age",
    maxWidth: 200,
    minWidth: 75,
  },
  {
    key: "sport",
    name: "sport",
    width: 150,
  },
];

export function CommonFlexColumn() {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [tableColumns, setTableColumns] = React.useState<ColumnOrderState>(
    COMMON_COLUMNS.map((col) => col.id ?? col.key),
  );
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({ id: 65 });

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
      rows={COMMON_ROW}
      // rows={[]}
      Empty={() => <span>Empty</span>}
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
      columnSizing={columnSizing}
      onColumnSizingChange={setColumnSizing}
      rubberColumn={true}
    />
  );
}
