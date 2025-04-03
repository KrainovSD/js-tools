import type { CellContext, HeaderContext, Row } from "@tanstack/react-table";
import type { TableInterface } from "./table";

export type TableTypesGetter<RowData extends Record<string, unknown>> = {
  headerContext: HeaderContext<RowData, unknown>;
  cellContext: CellContext<RowData, unknown>;
  row: Row<RowData>;
  table: TableInterface<RowData>;
};
