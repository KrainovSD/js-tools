import type { CellContext, ColumnDef, HeaderContext, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { TableRenderers } from "./types";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    cellRender: (props: { context: CellContext<TData, unknown> }) => ReactNode;
    headerRender: (props: { context: HeaderContext<TData, unknown> }) => ReactNode;
    filterRender: (props: ColumnDef<TData>) => ReactNode;
    sortRender: (props: { context: HeaderContext<TData, unknown> }) => ReactNode;
    headerClass: (string | ((props: HeaderContext<TData, unknown>) => string))[];
    cellClass: (string | ((props: CellContext<TData, unknown>) => string))[];

    name: string;
    icon?: ReactNode;

    cellRenderProps?: unknown;
    headerRenderProps?: unknown;
    filterRenderProps?: unknown;
    sortRenderProps?: unknown;
    props?: unknown;

    enableDraggable?: boolean;
  }

  interface TableMeta<TData extends RowData> {
    renderers: TableRenderers<TData>;
  }
}

export * from "./table";
export * from "./types";
export { useVisibleCell } from "./hooks";
