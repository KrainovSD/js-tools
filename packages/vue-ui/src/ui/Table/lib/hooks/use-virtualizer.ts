import {
  type PartialKeys,
  type VirtualizerOptions,
  useVirtualizer as useVirtualizerLibrary,
} from "@tanstack/vue-virtual";
import { type ComputedRef, computed, watch } from "vue";
import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../constants";
import type {
  CellClassInterface,
  CellRenderComponent,
  DefaultGanttData,
  DefaultRow,
  FilterFn,
  FilterRenderComponent,
  HeaderClassInterface,
  HeaderRenderComponent,
  SortFn,
  SortRenderComponent,
  TableInterface,
  TableProps,
} from "../../types";

type UseVirtualizerProps<RowData extends DefaultRow> = {
  table: TableInterface<RowData>;
  tableContainerRef: ComputedRef<HTMLDivElement | null | undefined>;
};

export function useVirtualizer<
  RowData extends DefaultRow,
  GanttData extends DefaultGanttData,
  CellRender extends Record<string, CellRenderComponent<RowData>> = {},
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
  FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
  SortRender extends Record<string, SortRenderComponent<RowData>> = {},
  CellClass extends Record<string, CellClassInterface<RowData>> = {},
  HeaderClass extends Record<string, HeaderClassInterface<RowData>> = {},
  FilterType extends Record<string, FilterFn<RowData>> = {},
  SortType extends Record<string, SortFn<RowData>> = {},
>(
  props: TableProps<
    RowData,
    GanttData,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >,
  extra: UseVirtualizerProps<RowData>,
) {
  /** COLUMNS */
  const columnVirtualEnabled = computed(() => Boolean(props.virtualColumn && !props.withGantt));
  const leftOffset = computed(() => {
    if (!columnVirtualEnabled.value) return 0;

    return extra.table.getLeftVisibleLeafColumns().reduce((acc, column) => {
      acc += column.getSize();

      return acc;
    }, 0);
  });
  const rightOffset = computed(() => {
    if (!columnVirtualEnabled.value) return 0;

    return extra.table.getRightVisibleLeafColumns().reduce((acc, column) => {
      acc += column.getSize();

      return acc;
    }, 0);
  });
  const columnVirtualizerOptions = computed<
    PartialKeys<
      VirtualizerOptions<HTMLDivElement, HTMLElement>,
      "observeElementRect" | "observeElementOffset" | "scrollToFn"
    >
  >(() => {
    const visibleColumns = extra.table.getCenterVisibleLeafColumns();

    return {
      count: visibleColumns.length,
      estimateSize: (index) => visibleColumns[index].getSize(),
      getScrollElement: () => extra.tableContainerRef.value ?? null,
      horizontal: true,
      overscan: props.virtualColumnOverScan ?? 2,
      enabled: columnVirtualEnabled.value,
      paddingStart: leftOffset.value,
      paddingEnd: rightOffset.value,
    };
  });
  const columnVirtualizer = useVirtualizerLibrary<HTMLDivElement, HTMLElement>(
    columnVirtualizerOptions,
  );
  const columnsVirtual = computed(() => columnVirtualizer.value.getVirtualItems());

  /** ROWS */
  const rows = computed(() => extra.table.getRowModel().rows);
  const rowVirtualEnabled = computed(() => Boolean(props.virtualRows));
  const rowVirtualizerOptions = computed<
    PartialKeys<
      VirtualizerOptions<HTMLDivElement, HTMLElement>,
      "observeElementRect" | "observeElementOffset" | "scrollToFn"
    >
  >(() => {
    return {
      count: rows.value.length,
      estimateSize: () =>
        props.withGantt
          ? props.ganttRowMini
            ? GANTT_ROW_HEIGHT_MINI
            : GANTT_ROW_HEIGHT
          : (props.virtualRowSize ?? 35),
      getScrollElement: () => extra.tableContainerRef.value ?? null,
      measureElement:
        typeof window !== "undefined" && navigator.userAgent.includes("Firefox")
          ? (element) => {
              return Math.round(element?.getBoundingClientRect?.()?.height);
            }
          : undefined,
      overscan: props.virtualRowOverScan ?? 4,
      enabled: rowVirtualEnabled.value,
    };
  });

  const rowVirtualizer = useVirtualizerLibrary<HTMLDivElement, HTMLElement>(rowVirtualizerOptions);
  const rowVirtual = computed(() => rowVirtualizer.value.getVirtualItems());

  watch(
    () => [extra.table.getTotalSize(), extra.table.getState().columnOrder],
    () => {
      columnVirtualizer.value.measure();
    },
  );

  return {
    rowVirtual,
    rows,
    columnsVirtual,
    columnVirtualEnabled,
    rowVirtualEnabled,
    columnVirtualizer,
    rowVirtualizer,
  };
}
