import type { CellContext, RowData } from "@tanstack/vue-table";
import type { Component } from "vue";
import type { ControlComponents } from "../Control.vue";
import VGantt from "./Gantt.vue";
import VTable from "./Table.vue";
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

export { VTable, VGantt };
export * from "./lib/get-gantt-column-width";
export * from "./lib/get-gantt-row-height";
export * from "./lib/extract-gantt-link-id";
export * from "./lib/check-cell-visible";
export * from "./lib/get-month-diff";
export * from "./lib/get-gantt-cell-month-shift";
export * from "./lib/get-gantt-cell-year-shift";
export * from "./lib/get-gantt-start-cell-by-month";
export * from "./lib/get-gantt-link-top-shift";

export * from "./types";

declare module "@tanstack/vue-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    cellRender: CellRenderComponent<TData> | undefined;
    headerRender: HeaderRenderComponent<TData> | undefined;
    sortRender: SortRenderComponent<TData> | undefined;
    filterRenders:
      | {
          component: FilterRenderComponent<TData> | keyof ControlComponents;
          props?: Record<string, unknown>;
          key: string;
          operatorValue?: string | number;
          operatorLabel?: string;
          operatorShortLabel?: string;
          displayValue?: keyof ControlComponents;
          clearTag?: string;
        }[]
      | undefined;
    headerClass: HeaderClassInterface<TData>[];
    cellClass: CellClassInterface<TData>[];
    name: string;
    icon?: Component;
    accessorKey: string;
    cellRenderProps?: unknown;
    headerRenderProps?: unknown;
    sortRenderProps?: unknown;
    props?: unknown;
    expandable?: boolean;
    expandedShift?: number;
    enableDraggable?: boolean;
    tooltip?: ColumnTooltipSettings<TData> | boolean;
    className?: ((context: CellContext<TData, unknown>) => string | undefined) | string;
    headerClassProps?: unknown;
    cellClassProps?: unknown;
    filterFn: string;
  }

  interface TableMeta<TData extends RowData> {
    renderers: TableRenderers<TData>;
    pageSizes?: number[];
    totalRows?: number;
  }
}
