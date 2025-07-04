/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
import type { ColumnOrderState, ExpandedState, RowSelectionState } from "@tanstack/react-table";
import React from "react";
import { Table } from "../../table";
import type { TableColumn } from "../../types";
import { COMMON_COLUMNS } from "../lib/common/columns";
import { COMMON_ROW } from "../lib/common/rows";
import type { CommonRow } from "../types/common";

type CellRenderKeys = "cell" | "cell2";
type CellRenderProps = { cell: { cellProps: number }; cell2: { cellProps2: number } };

type HeaderRenderKeys = "header" | "header2";
type HeaderRenderProps = { header: { headerProps: number }; header2: { headerProps2: number } };
type FilterRenderKeys = "filter" | "filter2";
type FilterRenderProps = { filter: { filterProps: number }; filter2: { filterProps2: number } };
type SortRenderKeys = "sort" | "sort2";
type SortRenderProps = { sort: { sortProps: number }; sort2: { sortProps2: number } };
type CellClassKeys = undefined;
type CellClassProps = { class1: number };
type HeaderClassKeys = undefined;
type HeaderClassProps = { headerClass1: number };
type FilterTypeKeys = undefined;
type SortTypeKeys = undefined;
type ColumnProps = { props: number };

// type TestGenericDefault = {
//   rowData: Record<string, unknown>;
//   ganttData: Record<string, unknown>;
//   cellRender: undefined | string;
//   cellRenderProps: Record<string, unknown>;

//   // RowData extends Record<string, unknown>,
//   // GanttData extends Record<string, unknown>,
//   // CellRender extends string | undefined = undefined,
//   // CellRenderProps extends Record<CellRender extends string ? CellRender : string, unknown> = Record<
//   //   CellRender extends string ? CellRender : string,
//   //   unknown
//   // >,
// };
// type WithDefaults<T extends Partial<TestGenericDefault>> = Omit<TestGenericDefault, keyof T> & T;

// type Test<T extends Partial<TestGenericDefault> = {}> = {
//   rowData: WithDefaults<T>["rowData"];
//   ganttData: WithDefaults<T>["ganttData"];
//   cellRender: T["cellRender"] extends string | undefined ? T["cellRender"] : undefined;
//   cellRenderProps: Record<T["cellRender"] extends string ? T["cellRender"] : string, unknown>;
// };

// const K: Test<{ cellRender: "kek" | "kek2"; cellRenderProps: { kek: {} } }>[] = [
//   { cellRender: "kek", cellRenderProps: {} },
// ];

type Column = TableColumn<
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
>;

// export type Columns<
//   CellRenderKey extends string,
//   CellRenderPropsMap extends Record<CellRenderKey, any>,
// > = {
//   [K in CellRenderKey]: {
//     cellRender: K;
//     cellRenderProps: CellRenderPropsMap[K];
//   };
// }[CellRenderKey];

// const c: Columns<CellRenderKeys, CellRenderProps>[] = [{ cellRender: "", cellRenderProps: {} }];

const COLUMNS: Column[] = [
  { key: "age", name: "Vozrast", cellRender: "cell", cellRenderProps: { cellProps: 2 } },
  { key: "age", name: "Vozrast", cellRender: "test2", cellRenderProps: { cell2: 2 } },
  { key: "age", name: "Vozrast", cellRender: "test2", cellRenderProps: { cell2: 2 } },
  { key: "age", name: "Vozrast", cellRender: "empty", cellRenderProps: undefined },
  {
    key: "age",
    name: "Vozrast",
    cellRender: "text",
    cellRenderProps: { autoTooltip: true },
    headerRender: "test2",
    headerRenderProps: { header2: 2 },
    filterRender: "test2",
    filterRenderProps: { filter2: 2 },
    sortRender: "test",
    sortRenderProps: { sort: 2 },
    cellClassProps: { test1: 2 },
    headerClassProps: { test2: 2 },
    props: { props: 2 },
  },

  // { key: "checked", name: "Checked", cellRender: "test2", cellRenderProps: { count: 1 } },
];

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
      columns={COLUMNS}
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
      // cellRenders={{ test: () => null, test2: () => null }}
      cellRenders={{}}
      onExpandedChange={setExpanded}
    />
  );
}
