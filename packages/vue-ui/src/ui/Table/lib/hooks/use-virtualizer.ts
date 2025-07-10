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
  DefaultRow,
  FilterFn,
  FilterRenderComponent,
  HeaderClassInterface,
  HeaderRenderComponent,
  SortFn,
  SortRenderComponent,
  TableColumn,
  TableInterface,
} from "../../types";

type UseVirtualizerProps<
  RowData extends DefaultRow,
  CellRender extends Record<string, CellRenderComponent<RowData>> = {},
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
  FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
  SortRender extends Record<string, SortRenderComponent<RowData>> = {},
  CellClass extends Record<string, CellClassInterface<RowData>> = {},
  HeaderClass extends Record<string, HeaderClassInterface<RowData>> = {},
  FilterType extends Record<string, FilterFn<RowData>> = {},
  SortType extends Record<string, SortFn<RowData>> = {},
> = {
  rows: RowData[];
  initialColumns: TableColumn<
    RowData,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >[];
  table: TableInterface<RowData>;
  tableContainerRef: ComputedRef<HTMLDivElement | null | undefined>;
  virtualColumn: boolean | undefined;
  virtualColumnOverScan: number | undefined;
  virtualRows: boolean | undefined;
  virtualRowSize: number | undefined;
  virtualRowOverScan: number | undefined;
  gantt: boolean | undefined;
  ganttMini: boolean | undefined;
};

export function useVirtualizer<
  RowData extends DefaultRow,
  CellRender extends Record<string, CellRenderComponent<RowData>> = {},
  HeaderRender extends Record<string, HeaderRenderComponent<RowData>> = {},
  FilterRender extends Record<string, FilterRenderComponent<RowData>> = {},
  SortRender extends Record<string, SortRenderComponent<RowData>> = {},
  CellClass extends Record<string, CellClassInterface<RowData>> = {},
  HeaderClass extends Record<string, HeaderClassInterface<RowData>> = {},
  FilterType extends Record<string, FilterFn<RowData>> = {},
  SortType extends Record<string, SortFn<RowData>> = {},
>(
  props: UseVirtualizerProps<
    RowData,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >,
) {
  /** COLUMNS */
  const columnVirtualEnabled = computed(() => Boolean(props.virtualColumn && !props.gantt));
  const leftOffset = computed(() => {
    if (!columnVirtualEnabled.value) return 0;

    return props.table.getLeftVisibleLeafColumns().reduce((acc, column) => {
      acc += column.getSize();

      return acc;
    }, 0);
  });
  const rightOffset = computed(() => {
    if (!columnVirtualEnabled.value) return 0;

    return props.table.getRightVisibleLeafColumns().reduce((acc, column) => {
      acc += column.getSize();

      return acc;
    }, 0);
  });
  const columnVirtualizerOptions = computed<
    PartialKeys<
      VirtualizerOptions<HTMLDivElement, Element>,
      "observeElementRect" | "observeElementOffset" | "scrollToFn"
    >
  >(() => {
    const visibleColumns = props.table.getCenterVisibleLeafColumns();

    return {
      count: visibleColumns.length,
      estimateSize: (index) => visibleColumns[index].getSize(),
      getScrollElement: () => props.tableContainerRef.value ?? null,
      horizontal: true,
      overscan: props.virtualColumnOverScan ?? 2,
      enabled: columnVirtualEnabled.value,
      paddingStart: leftOffset.value,
      paddingEnd: rightOffset.value,
    };
  });
  const columnVirtualizer = useVirtualizerLibrary<HTMLDivElement, Element>(
    columnVirtualizerOptions,
  );
  const columnsVirtual = computed(() => columnVirtualizer.value.getVirtualItems());

  /** ROWS */
  const rows = computed(() => props.table.getRowModel().rows);
  const rowVirtualEnabled = computed(() => props.virtualRows);
  const rowVirtualizerOptions = computed<
    PartialKeys<
      VirtualizerOptions<HTMLDivElement, Element>,
      "observeElementRect" | "observeElementOffset" | "scrollToFn"
    >
  >(() => {
    return {
      count: rows.value.length,
      estimateSize: () =>
        props.gantt
          ? props.ganttMini
            ? GANTT_ROW_HEIGHT_MINI
            : GANTT_ROW_HEIGHT
          : (props.virtualRowSize ?? 35),
      getScrollElement: () => props.tableContainerRef.value ?? null,
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

  const rowVirtualizer = useVirtualizerLibrary<HTMLDivElement, Element>(rowVirtualizerOptions);
  const rowVirtual = computed(() => rowVirtualizer.value.getVirtualItems());

  watch(
    () => [props.table.getTotalSize(), props.table.getState().columnOrder],
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
