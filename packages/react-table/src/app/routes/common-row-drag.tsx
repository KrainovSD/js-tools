/* eslint-disable no-console */
import type {
  ColumnOrderState,
  ColumnSizingState,
  ExpandedState,
  RowSelectionState,
} from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type { DragRowHandler, RowInterface } from "../../types";
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
    id: "drag",
    key: "id",
    name: "",
    width: 70,
    resizable: false,
    sortable: false,
    sortType: "string-with-number",
    draggable: false,
    cellRender: {
      component: "drag",
    },
    additionalCellClass: ["wCenter", "hCenter"],
  },
  {
    key: "id",
    name: "ID",
    width: 100,
    resizable: true,
    sortType: "string-with-number",
    draggable: false,
  },
  {
    key: "firstName",
    name: "First Name",
    minWidth: 500,
    resizable: true,
    draggable: true,
    sortable: true,
    expandable: true,
    filterRender: { component: "string" },
    filterable: true,
    filterType: "includes-string",
    headerClass: ["common"],
    additionalCellClass: ["lineClamp", "hCenter"],
    tooltip: {
      auto: true,
    },
    expandedShift: 25,
  },
  {
    key: "lastName",
    name: "Last Name",
    filterable: true,
    width: 200,
    filterRender: { component: "string" },
    filterType: "includes-string",
    additionalCellClass: ["hCenter"],
    resizable: true,
    draggable: true,
    sortable: true,
    // leftFrozen: true,
  },
  {
    id: "lastName_2",
    key: "lastName",
    name: "Last Name 2",
    width: 200,
    filterable: true,
    filterRender: { component: "string" },
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
    width: 250,
    filterable: true,
    filterRender: { component: "string" },
    filterType: "includes-string",
    resizable: true,
    draggable: true,
    sortable: true,
    additionalCellClass: ["common", "empty", "lineClamp"],
    headerClass: ["common", "lineClamp"],
    cellRender: {
      component: "default",
      props: {
        Link: (props) => {
          // eslint-disable-next-line react/prop-types
          return <a href={props.context.row.original.country}>{props.children}</a>;
        },
      },
    },
    // leftFrozen: true,
  },
];

export function CommonRowDrag() {
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [tableColumns, setTableColumns] = React.useState<ColumnOrderState>(
    COMMON_COLUMNS.map((col) => col.id ?? col.key),
  );
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({ id: 65 });
  const [rows, setRows] = React.useState(COMMON_ROW.splice(0, 50));

  function onClick(row: RowInterface<CommonRow>) {
    console.log(row, "click");
  }
  function onDoubleClick(row: RowInterface<CommonRow>) {
    console.log(row, "dbClick");
  }

  const onDraggableRow: DragRowHandler = (sourceIndex, targetIndex) => {
    const row = rows[sourceIndex];
    const draggedRows = rows.toSpliced(sourceIndex, 1);
    draggedRows.splice(targetIndex, 0, row);

    setRows(draggedRows);
  };

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
      rows={rows}
      Empty={() => <span>Empty</span>}
      getSubRows={(row) => row.children}
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
      draggableRow
      onDraggableRow={onDraggableRow}
    />
  );
}
