import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import type { HeaderInterface, RowInterface, TableInterface } from "../../types";
import styles from "./table-common.module.scss";
import { TableHeaderRow } from "./table-header-row";
import { TableRow } from "./table-row";

type TableContainerProps<RowData extends Record<string, unknown>> = {
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
  rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
  headerRowClassName:
    | ((header: HeaderInterface<RowData>) => string | undefined)
    | string
    | undefined;
};

export function TableCommon<RowData extends Record<string, unknown>>(
  props: TableContainerProps<RowData>,
) {
  const leftHeadersGroup = props.table.getLeftHeaderGroups();
  const centerHeadersGroup = props.table.getCenterHeaderGroups();
  const rightHeadersGroup = props.table.getRightHeaderGroups();

  return (
    <table
      className={styles.table}
      style={{
        width: props.columnVirtualEnabled ? props.table.getTotalSize() : "100%",
      }}
      data-id="table"
    >
      <thead
        className={clsx(
          styles.header,
          (props.frozenHeader || props.frozenHeader == undefined) && styles.header__frozen,
        )}
        data-id="header"
      >
        {props.table.getHeaderGroups().map((headerGroup, index) => {
          const leftHeaders = leftHeadersGroup[index].headers;
          const centerHeaders = centerHeadersGroup[index].headers;
          const rightHeaders = rightHeadersGroup[index].headers;

          /** ROW HEADER */
          return (
            <TableHeaderRow<RowData>
              key={`${headerGroup.id}-header-row`}
              columnVirtualEnabled={props.columnVirtualEnabled}
              columnsVirtual={props.columnsVirtual}
              headerGroup={headerGroup}
              centerHeaders={centerHeaders}
              leftHeaders={leftHeaders}
              rightHeaders={rightHeaders}
              totalWidth={props.table.getTotalSize()}
              headerRowClassName={props.headerRowClassName}
            />
          );
        })}
      </thead>
      <tbody
        className={styles.body}
        style={{
          height: props.rowVirtualEnabled ? `${props.rowVirtualizer.getTotalSize()}px` : undefined,
        }}
        data-id="body"
      >
        {props.rowVirtualEnabled &&
          props.rowsVirtual.map((virtualRow) => {
            return (
              <TableRow<RowData>
                virtualRow={virtualRow}
                columnVirtualEnabled={props.columnVirtualEnabled}
                columnsVirtual={props.columnsVirtual}
                rowClassName={props.rowClassName}
                rows={props.rows}
                key={`${virtualRow.index}-row`}
                onClickRow={props.onClickRow}
                onDoubleClickRow={props.onDoubleClickRow}
                rowVirtualizer={props.rowVirtualizer}
                totalWidth={props.table.getTotalSize()}
                row={null}
              />
            );
          })}
        {!props.rowVirtualEnabled &&
          props.rows.map((row) => {
            return (
              <TableRow
                columnVirtualEnabled={props.columnVirtualEnabled}
                columnsVirtual={props.columnsVirtual}
                row={row}
                rowClassName={props.rowClassName}
                key={`${row.id}-row`}
                onClickRow={props.onClickRow}
                onDoubleClickRow={props.onDoubleClickRow}
                totalWidth={props.table.getTotalSize()}
                rowVirtualizer={props.rowVirtualizer}
                rows={props.rows}
                virtualRow={null}
              />
            );
          })}
      </tbody>
    </table>
  );
}
