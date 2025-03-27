import type { CellContext, HeaderContext } from "@tanstack/react-table";

export type TableTypesGetter<Row extends Record<string, unknown>> = {
  headerContext: HeaderContext<Row, unknown>;
  cellContext: CellContext<Row, unknown>;
};
