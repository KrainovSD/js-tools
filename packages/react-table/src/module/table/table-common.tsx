import type { ColumnSizingState } from "@tanstack/react-table";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import React from "react";
import { DEFAULT_TABLE_COLUMN_SIZE } from "../../table.constants";
import type { HeaderInterface, RowInterface, TableEmptyProps, TableInterface } from "../../types";
import styles from "./table-common.module.scss";
import { TableHeaderRow } from "./table-header-row";
import { TableRow } from "./table-row";

type TableContainerProps<RowData extends Record<string, unknown>> = {
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
  Empty: React.FC<TableEmptyProps> | undefined;
};

export function TableCommon<RowData extends Record<string, unknown>>(
  props: TableContainerProps<RowData>,
) {
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
    const defaultColumnSize = props.table._getDefaultColumnDef().size ?? DEFAULT_TABLE_COLUMN_SIZE;

    const columnSizing: ColumnSizingState = {};
    let totalWidth = 0;
    let totalWidthWithFlexColumn = 0;
    let flexColumnCount = 0;

    for (let i = 0; i < visibleHeaders.length; i++) {
      const width = visibleHeaders[i].column.getSize();
      const id = visibleHeaders[i].column.id;

      if (width === 0) {
        totalWidthWithFlexColumn += defaultColumnSize;
        flexColumnCount += 1;
      } else {
        totalWidthWithFlexColumn += width;
        totalWidth += width;
      }
      columnSizing[id] = width;
    }

    if (flexColumnCount === 0) return;

    const flexColumnSize =
      tableWidth >= totalWidthWithFlexColumn
        ? (tableWidth - totalWidth) / flexColumnCount
        : defaultColumnSize;
    for (const [key, value] of Object.entries(columnSizing)) {
      if (value === 0) columnSizing[key] = flexColumnSize;
    }

    props.table.setColumnSizing(columnSizing);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <table
      className={styles.table}
      style={
        {
          "--table-template-columns": templateColumns.join(" "),
          "--table-total-width": props.table.getTotalSize(),
        } as React.CSSProperties
      }
      ref={tableRef}
      data-id="table"
    >
      <thead
        className={clsx(
          styles.header,
          (props.frozenHeader || props.frozenHeader == undefined) && styles.header__frozen,
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
              page={tableState.pagination.pageIndex}
              selectedPage={selected}
              filterState={tableState.columnFilters}
              sortState={tableState.sorting}
            />
          );
        })}
      </thead>
      <tbody
        className={styles.body}
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
              />
            );
          })}
        {props.rowVirtualEnabled && props.rowsVirtual.length === 0 && props.Empty && (
          <props.Empty />
        )}
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
              />
            );
          })}
        {!props.rowVirtualEnabled && props.rows.length === 0 && props.Empty && <props.Empty />}
      </tbody>
    </table>
  );
}
