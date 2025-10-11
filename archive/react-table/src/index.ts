import type { CellContext, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type {
  CellClassInterface,
  CellRenderComponent,
  ColumnTooltipSettings,
  FilterRenderComponent,
  HeaderClassInterface,
  HeaderRenderComponent,
  SortRenderComponent,
  TableRenderers,
} from "./types";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    cellRender: CellRenderComponent<TData> | undefined;
    headerRender: HeaderRenderComponent<TData> | undefined;
    sortRender: SortRenderComponent<TData> | undefined;
    filterRender: FilterRenderComponent<TData> | undefined;
    headerClass: HeaderClassInterface<TData>[];
    cellClass: CellClassInterface<TData>[];
    name: string;
    icon?: ReactNode;
    accessorKey: string;
    cellRenderProps?: unknown;
    headerRenderProps?: unknown;
    filterRenderProps?: unknown;
    sortRenderProps?: unknown;
    headerClassProps?: unknown;
    cellClassProps?: unknown;
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
export { useVisibleCell } from "./lib/hooks";
export * from "./components/cell-renders/wrappers";
export * from "./components/header-renders/wrappers";
