import type { CellContext, RowData } from "@tanstack/vue-table";
import type { Component } from "vue";
import type { FilterComponentKey } from "../Filter.vue";
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

export { VTable };
export * from "./types";
export { checkCellVisible } from "./lib";

declare module "@tanstack/vue-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    cellRender: CellRenderComponent<TData> | undefined;
    headerRender: HeaderRenderComponent<TData> | undefined;
    sortRender: SortRenderComponent<TData> | undefined;
    filterRenders:
      | {
          component: FilterRenderComponent<TData>;
          props?: unknown;
          key: string;
          operatorValue?: string | number;
          operatorLabel?: string;
          displayValue?: FilterComponentKey;
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
