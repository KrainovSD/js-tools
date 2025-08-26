import type { Table } from "@tanstack/react-table";
import { useVirtualizer as useVirtualizerLibrary } from "@tanstack/react-virtual";
import React from "react";
import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../../table.constants";
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
} from "../../../types";

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
  table: Table<RowData>;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
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
  const columnVirtualEnabled = Boolean(props.virtualColumn && !props.gantt);
  const visibleColumns = props.table.getCenterVisibleLeafColumns();
  const leftColumns = props.table.getLeftVisibleLeafColumns();
  const rightColumns = props.table.getRightVisibleLeafColumns();
  const totalWidth = props.table.getTotalSize();
  const orderState = props.table.getState().columnOrder;

  const leftOffset = React.useMemo(() => {
    if (!columnVirtualEnabled) return 0;

    return leftColumns.reduce((acc, column) => {
      acc += column.getSize();

      return acc;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftColumns, totalWidth, columnVirtualEnabled]);
  const rightOffset = React.useMemo(() => {
    if (!columnVirtualEnabled) return 0;

    return rightColumns.reduce((acc, column) => {
      acc += column.getSize();

      return acc;
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightColumns, totalWidth, columnVirtualEnabled]);

  const columnVirtualizer = useVirtualizerLibrary<HTMLDivElement, HTMLTableCellElement>({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => props.tableContainerRef.current,
    horizontal: true,
    overscan: props.virtualColumnOverScan ?? 2,
    enabled: columnVirtualEnabled,
    paddingStart: leftOffset,
    paddingEnd: rightOffset,
  });
  const columnsVirtual = columnVirtualizer.getVirtualItems();

  React.useLayoutEffect(() => {
    columnVirtualizer.measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalWidth, orderState]);

  const { rows } = props.table.getRowModel();

  const rowVirtualEnabled = Boolean(props.virtualRows);
  const rowVirtualizer = useVirtualizerLibrary<HTMLDivElement, HTMLElement>({
    count: rows.length,
    estimateSize: () =>
      props.gantt
        ? props.ganttMini
          ? GANTT_ROW_HEIGHT_MINI
          : GANTT_ROW_HEIGHT
        : (props.virtualRowSize ?? 35),
    getScrollElement: () => props.tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.includes("Firefox")
        ? (element) => {
            return Math.round(element?.getBoundingClientRect?.()?.height);
          }
        : undefined,
    overscan: props.virtualRowOverScan ?? 4,
    enabled: rowVirtualEnabled,
  });
  const rowVirtual = rowVirtualizer.getVirtualItems();

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
