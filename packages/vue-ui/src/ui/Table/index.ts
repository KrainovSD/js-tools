import type { CellContext, ColumnDef, HeaderContext, RowData } from "@tanstack/vue-table";
import VTable from "./Table.vue";
import type { ColumnTooltipSettings, TableRenderers } from "./types";

export { VTable };

declare module "@tanstack/vue-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    cellRender: ((props: { context: CellContext<TData, unknown> }) => React.ReactNode) | undefined;
    headerRender:
      | ((props: { context: HeaderContext<TData, unknown> }) => React.ReactNode)
      | undefined;
    filterRender: ((props: ColumnDef<TData>) => React.ReactNode) | undefined;
    sortRender:
      | ((props: { context: HeaderContext<TData, unknown> }) => React.ReactNode)
      | undefined;
    headerClass: (string | ((props: HeaderContext<TData, unknown>) => string))[];
    cellClass: (string | ((props: CellContext<TData, unknown>) => string))[];
    name: string;
    icon?: React.ReactNode;
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
