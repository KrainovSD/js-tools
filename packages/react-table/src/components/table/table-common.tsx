import type { ColumnSizingState } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import type {
  ColumnSizingSettings,
  DefaultRow,
  DragRowHandler,
  HeaderInterface,
  RowInterface,
  TableInterface,
} from "../../types";
import styles from "./table-common.module.scss";
import { TableHeaderRow } from "./table-header-row";
import { TableRow } from "./table-row";

type TableContainerProps<RowData extends DefaultRow> = {
  rubberColumn: boolean;
  columnVirtualEnabled: boolean;
  rowVirtualEnabled: boolean;
  table: TableInterface<RowData>;
  frozenHeader: boolean;
  columnsVirtual: VirtualItem[];
  rowsVirtual: VirtualItem[];
  rows: RowInterface<RowData>[];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  onClickRow:
    | ((row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void)
    | undefined;
  onDoubleClickRow:
    | ((row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void)
    | undefined;
  rowRender: ((row: RowInterface<RowData>) => React.JSX.Element | null | undefined) | undefined;
  rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
  headerRowClassName:
    | ((header: HeaderInterface<RowData>) => string | undefined)
    | string
    | undefined;
  draggableRow: boolean;
  onDraggableRow: DragRowHandler | undefined;
};

export function TableCommon<RowData extends DefaultRow>(props: TableContainerProps<RowData>) {
  const leftHeadersGroup = props.table.getLeftHeaderGroups();
  const centerHeadersGroup = props.table.getCenterHeaderGroups();
  const rightHeadersGroup = props.table.getRightHeaderGroups();
  const visibleHeadersGroup = props.table.getHeaderGroups();
  const tableState = props.table.getState();
  const tableRef = React.useRef<HTMLTableElement | null>(null);

  const virtualColumnsIndexesKey =
    props.columnsVirtual.length === 0
      ? null
      : props.columnsVirtual.map((virtual) => virtual.index).join(";");
  const virtualColumns = React.useMemo(() => {
    return virtualColumnsIndexesKey ? virtualColumnsIndexesKey.split(";") : [];
  }, [virtualColumnsIndexesKey]);

  const templateColumns =
    visibleHeadersGroup[0]?.headers?.map?.((header) => `${header.column.getSize()}px`) ?? [];

  React.useLayoutEffect(() => {
    if (!tableRef.current || !props.rubberColumn) return;

    const tableWidth = tableRef.current.getBoundingClientRect().width;
    const visibleHeaders = visibleHeadersGroup?.[0]?.headers ?? [];

    const columnSizing: ColumnSizingState = {};
    const columnSizingSettings: ColumnSizingSettings = {};
    let totalWidth = 0;
    let flexColumnCount = 0;

    for (let i = 0; i < visibleHeaders.length; i++) {
      const column = visibleHeaders[i].column;
      const size = column.columnDef.size;
      const maxSize = column.columnDef.maxSize;
      const minSize = column.columnDef.minSize;

      const width = column.getSize();
      const id = column.id;

      if (size === 0) {
        flexColumnCount += 1;
      } else {
        totalWidth += width;
      }
      columnSizing[id] = size === 0 ? 0 : width;
      columnSizingSettings[id] = {
        maxSize,
        minSize,
      };
    }

    if (flexColumnCount === 0) return;

    let hasConflictSize = true;
    /** Processing max size less then flex size and min size greater than flex size  */
    while (hasConflictSize) {
      hasConflictSize = false;
      let flexColumnSize = (tableWidth - totalWidth) / flexColumnCount;

      for (const [key, value] of Object.entries(columnSizing)) {
        if (value === 0) {
          const maxSize = columnSizingSettings[key].maxSize;

          if (maxSize != undefined && maxSize < flexColumnSize) {
            columnSizing[key] = maxSize;
            totalWidth += maxSize;
            flexColumnCount -= 1;
            hasConflictSize = true;
            continue;
          }
        }
      }

      flexColumnSize = (tableWidth - totalWidth) / flexColumnCount;

      for (const [key, value] of Object.entries(columnSizing)) {
        if (value === 0) {
          const minSize = columnSizingSettings[key].minSize;

          if (minSize != undefined && minSize > flexColumnSize) {
            columnSizing[key] = minSize;
            totalWidth += minSize;
            flexColumnCount -= 1;
            hasConflictSize = true;
            continue;
          }
        }
      }
    }

    if (flexColumnCount === 0) {
      props.table.setColumnSizing(columnSizing);

      return;
    }

    /** Processing flex size  */
    const flexColumnSize = (tableWidth - totalWidth) / flexColumnCount;
    for (const [key, value] of Object.entries(columnSizing)) {
      if (value === 0) {
        columnSizing[key] = flexColumnSize;
      }
    }

    props.table.setColumnSizing(columnSizing);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="table"
      className={clsx(styles.table, "ksd-table")}
      style={
        {
          "--table-template-columns": templateColumns.join(" "),
          "--table-total-width": props.table.getTotalSize(),
        } as React.CSSProperties
      }
      ref={tableRef}
      data-id="table"
    >
      <div
        role="rowgroup"
        className={clsx(
          styles.header,
          (props.frozenHeader || props.frozenHeader == undefined) && styles.header__frozen,
          "ksd-table-header",
        )}
        data-id="header"
      >
        {visibleHeadersGroup.map((headerGroup, index) => {
          const leftHeaders = leftHeadersGroup[index].headers;
          const centerHeaders = centerHeadersGroup[index].headers;
          const rightHeaders = rightHeadersGroup[index].headers;

          const selected = props.table.getIsAllPageRowsSelected();

          /** ROW HEADER */
          return (
            <TableHeaderRow<RowData>
              key={`${headerGroup.id}-header-row`}
              columnVirtualEnabled={props.columnVirtualEnabled}
              columnsVirtual={virtualColumns}
              headerGroup={headerGroup}
              centerHeaders={centerHeaders}
              leftHeaders={leftHeaders}
              rightHeaders={rightHeaders}
              headerRowClassName={props.headerRowClassName}
              selectedPage={selected}
              page={tableState.pagination.pageIndex}
              filterState={tableState.columnFilters}
              sortState={tableState.sorting}
              height={undefined}
            />
          );
        })}
      </div>
      <div
        role="rowgroup"
        className={clsx(styles.body, "ksd-table-body")}
        style={{
          height:
            props.rowVirtualEnabled && props.rowsVirtual.length > 0
              ? `${props.rowVirtualizer.getTotalSize()}px`
              : undefined,
        }}
        data-id="body"
      >
        {props.rowVirtualEnabled &&
          props.rowsVirtual.map((virtualRow) => {
            const selected = props.rows[virtualRow.index]?.getIsSelected?.();
            const row = props.rows[virtualRow.index];
            const expanded = row.getIsExpanded();
            const CustomRow = props.rowRender?.(row);
            const visibleCells = row.getVisibleCells();

            return (
              <TableRow<RowData>
                virtualRow={virtualRow}
                key={`${virtualRow.index}-row`}
                columnVirtualEnabled={props.columnVirtualEnabled}
                columnsVirtual={virtualColumns}
                rowClassName={props.rowClassName}
                rows={props.rows}
                onClickRow={props.onClickRow}
                onDoubleClickRow={props.onDoubleClickRow}
                rowVirtualizer={props.rowVirtualizer}
                row={null}
                selected={selected}
                expanded={expanded}
                CustomRow={CustomRow}
                visibleCells={visibleCells}
                height={undefined}
                draggableRow={props.draggableRow}
                onDraggableRow={props.onDraggableRow}
              />
            );
          })}

        {!props.rowVirtualEnabled &&
          props.rows.map((row) => {
            const selected = row.getIsSelected();
            const expanded = row.getIsExpanded();
            const CustomRow = props.rowRender?.(row);
            const visibleCells = row.getVisibleCells();

            return (
              <TableRow<RowData>
                key={`${row.id}-row`}
                columnVirtualEnabled={props.columnVirtualEnabled}
                columnsVirtual={virtualColumns}
                row={row}
                rowClassName={props.rowClassName}
                onClickRow={props.onClickRow}
                onDoubleClickRow={props.onDoubleClickRow}
                rowVirtualizer={props.rowVirtualizer}
                rows={props.rows}
                virtualRow={null}
                selected={selected}
                expanded={expanded}
                CustomRow={CustomRow}
                visibleCells={visibleCells}
                height={undefined}
                draggableRow={props.draggableRow}
                onDraggableRow={props.onDraggableRow}
              />
            );
          })}
      </div>
    </div>
  );
}
