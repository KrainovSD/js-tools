import type { Table } from "@tanstack/react-table";
import { useVirtualizer as useVirtualizerLibrary } from "@tanstack/react-virtual";
import { GANTT_ROW_HEIGHT, GANTT_ROW_HEIGHT_MINI } from "../../../table.constants";
import type { TableColumn } from "../../../types";

type UseVirtualizerProps<
  Row extends Record<string, unknown>,
  CellRender = undefined,
  HeaderRender = undefined,
  FilterRender = undefined,
  SortRender = undefined,
  CellClass = undefined,
  HeaderClass = undefined,
  FilterType = undefined,
  SortType = undefined,
> = {
  rows: Row[];
  initialColumns: TableColumn<
    Row,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >[];
  table: Table<Row>;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  virtualColumn?: boolean;
  virtualRows?: boolean;
  virtualRowSize?: number;
  gantt?: boolean;
  ganttMini?: boolean;
};

export function useVirtualizer<
  Row extends Record<string, unknown>,
  CellRender = undefined,
  HeaderRender = undefined,
  FilterRender = undefined,
  SortRender = undefined,
  CellClass = undefined,
  HeaderClass = undefined,
  FilterType = undefined,
  SortType = undefined,
>(
  props: UseVirtualizerProps<
    Row,
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
  const columnVirtualEnabled = Boolean(props.virtualColumn);
  const visibleColumns = props.table.getCenterVisibleLeafColumns();
  const columnVirtualizer = useVirtualizerLibrary<HTMLDivElement, HTMLTableCellElement>({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => props.tableContainerRef.current,
    horizontal: true,
    overscan: 2,
    enabled: columnVirtualEnabled,
  });
  const columnsVirtual = columnVirtualizer.getVirtualItems();
  //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;
  if (columnVirtualizer && columnsVirtual?.length) {
    virtualPaddingLeft = columnsVirtual[0]?.start ?? 0;
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() - (columnsVirtual[columnsVirtual.length - 1]?.end ?? 0);
  }

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
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 4,
    enabled: rowVirtualEnabled,
  });
  const rowVirtual = rowVirtualizer.getVirtualItems();

  return {
    rowVirtual,
    rows,
    columnsVirtual,
    virtualPaddingLeft,
    virtualPaddingRight,
    columnVirtualEnabled,
    rowVirtualEnabled,
    columnVirtualizer,
    rowVirtualizer,
  };
}
