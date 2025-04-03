import type { CellContext, HeaderContext, Row } from "@tanstack/react-table";

export type TableTypesGetter<RowData extends Record<string, unknown>> = {
  headerContext: HeaderContext<RowData, unknown>;
  cellContext: CellContext<RowData, unknown>;
  row: Row<RowData>;
};
