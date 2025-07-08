import type { CellContext, ColumnDef, HeaderContext, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { ColumnTooltipSettings, TableRenderers } from "./types";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    cellRender: ((props: { context: CellContext<TData, unknown> }) => ReactNode) | undefined;
    headerRender: ((props: { context: HeaderContext<TData, unknown> }) => ReactNode) | undefined;
    filterRender: ((props: ColumnDef<TData>) => ReactNode) | undefined;
    sortRender: ((props: { context: HeaderContext<TData, unknown> }) => ReactNode) | undefined;
    headerClass: (string | ((props: HeaderContext<TData, unknown>) => string))[];
    cellClass: (string | ((props: CellContext<TData, unknown>) => string))[];
    name: string;
    icon?: ReactNode;
    accessorKey: string;
    cellRenderProps?: unknown;
    headerRenderProps?: unknown;
    filterRenderProps?: unknown;
    sortRenderProps?: unknown;
    props?: unknown;
    expandable?: boolean;
    expandedShift?: number;
    enableDraggable?: boolean;
    tooltip?: ColumnTooltipSettings<TData> | boolean;
    className?: ((context: CellContext<TData, unknown>) => string | undefined) | string;
  }

  interface TableMeta<TData extends RowData> {
    renderers: TableRenderers<TData>;
    pageSizes?: number[];
    totalRows?: number;
  }
}

export * from "./table";
export * from "./types";
export { useVisibleCell } from "./module/table/hooks";
