/* eslint-disable no-console */
import type {
  ColumnOrderState,
  ColumnSizingState,
  ExpandedState,
  RowSelectionState,
} from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type { RowInterface, TableColumn } from "../../types";
import { COMMON_ROW } from "../lib/common/rows";
import type {
  CellClassKeys,
  CellClassProps,
  CellRenderKeys,
  CellRenderProps,
  ColumnProps,
  CommonRow,
  FilterRenderKeys,
  FilterRenderProps,
  FilterTypeKeys,
  HeaderClassKeys,
  HeaderClassProps,
  HeaderRenderKeys,
  HeaderRenderProps,
  SortRenderKeys,
  SortRenderProps,
  SortTypeKeys,
} from "../types/common";

const COMMON_COLUMNS: TableColumn<
  CommonRow,
  CellRenderKeys,
  CellRenderProps,
  HeaderRenderKeys,
  HeaderRenderProps,
  FilterRenderKeys,
  FilterRenderProps,
  SortRenderKeys,
  SortRenderProps,
  CellClassKeys,
  CellClassProps,
  HeaderClassKeys,
  HeaderClassProps,
  FilterTypeKeys,
  SortTypeKeys,
  ColumnProps
>[] = [
  {
    key: "id",
    name: "ID",
    width: 100,
    resizable: true,
    sortType: "string-with-number",
    draggable: false,
    leftFrozen: true,
  },
  {
    key: "firstName",
    name: "First Name",
    resizable: true,
    draggable: true,
    sortable: true,
    expandable: true,
    filterRender: "string",
    filterable: true,
    filterType: "includes-string",
    headerClass: ["common"],
    additionalCellClass: ["lineClamp", "hCenter"],
    tooltip: {
      auto: true,
    },
  },
  {
    key: "lastName",
    name: "Last Name",
    width: 200,
    filterable: true,
    filterRender: "string",
    filterType: "includes-string",
    additionalCellClass: ["hCenter"],
    resizable: true,
    draggable: true,
    sortable: true,
    // leftFrozen: true,
  },
  {
    key: "description",
    name: "Очень длинное название колонки для тестов переноса строк",
    width: 234,
    filterable: true,
    filterRender: "string",
    filterType: "includes-string",
    resizable: true,
    draggable: true,
    sortable: true,
    additionalCellClass: ["common", "empty", "lineClamp"],
    headerClass: ["common", "lineClamp"],
    cellRender: "default",
    cellRenderProps: {
      Link: (props) => {
        // eslint-disable-next-line react/prop-types
        return <a href={props.context.row.original.country}>{props.children}</a>;
      },
    },
    // leftFrozen: true,
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
      CellRenderKeys,
      CellRenderProps,
      HeaderRenderKeys,
      HeaderRenderProps,
      FilterRenderKeys,
      FilterRenderProps,
      SortRenderKeys,
      SortRenderProps,
      CellClassKeys,
      CellClassProps,
      HeaderClassKeys,
      HeaderClassProps,
      FilterTypeKeys,
      SortTypeKeys,
      ColumnProps
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
