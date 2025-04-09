import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { useTableCell } from "./hooks";
import styles from "./table-common.module.scss";
import type { RowInterface, TableInterface } from "./types";

type TableContainerProps<RowData extends Record<string, unknown>> = {
  columnVirtualEnabled: boolean;
  rowVirtualEnabled: boolean;
  table: TableInterface<RowData>;
  frozenHeader: boolean;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  columnsVirtual: VirtualItem[];
  rowsVirtual: VirtualItem[];
  rows: RowInterface<RowData>[];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
};

export function TableCommon<RowData extends Record<string, unknown>>(
  props: TableContainerProps<RowData>,
) {
  const { getCell, getHeader } = useTableCell<RowData>(true);

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
        {props.table.getHeaderGroups().map((headerGroup) => {
          /** ROW HEADER */
          return (
            <tr key={headerGroup.id} className={styles.headerRow} data-id="header-row">
              {props.columnVirtualEnabled && (
                <>
                  {props.virtualPaddingLeft ? (
                    <th
                      style={{ display: "flex", width: props.virtualPaddingLeft }}
                      data-id="header-cell"
                    />
                  ) : null}
                  {props.columnsVirtual.map((virtualColumn) => {
                    /** CELL HEADER  */
                    const header = headerGroup.headers[virtualColumn.index];

                    return getHeader(header, virtualColumn.index, headerGroup.headers);
                  })}
                  {props.virtualPaddingRight ? (
                    <th
                      style={{ display: "flex", width: props.virtualPaddingRight }}
                      data-id="header-cell"
                    />
                  ) : null}
                </>
              )}
              {!props.columnVirtualEnabled && headerGroup.headers.map(getHeader)}
            </tr>
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
            const row = props.rows[virtualRow.index];
            const visibleCells = row.getVisibleCells();

            /** ROW */
            return (
              <tr
                data-id="row"
                key={row.id}
                className={clsx(styles.row, styles.row__virtual)}
                data-index={virtualRow.index}
                ref={(node) => props.rowVirtualizer.measureElement(node)}
                style={{
                  transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scrolls
                }}
                onClick={(event) => {
                  props.onClickRow?.(row, event);
                }}
                onDoubleClick={(event) => {
                  props.onDoubleClickRow?.(row, event);
                }}
              >
                {props.columnVirtualEnabled && (
                  <>
                    {props.virtualPaddingLeft ? (
                      <td
                        data-id="cell"
                        style={{ display: "flex", width: props.virtualPaddingLeft }}
                      />
                    ) : null}
                    {props.columnsVirtual.map((virtualColumn) => {
                      /** CELL */
                      const cell = visibleCells[virtualColumn.index];

                      return getCell(cell, virtualColumn.index, visibleCells);
                    })}
                    {props.virtualPaddingRight ? (
                      <td
                        data-id="cell"
                        style={{ display: "flex", width: props.virtualPaddingRight }}
                      />
                    ) : null}
                  </>
                )}
                {!props.columnVirtualEnabled &&
                  visibleCells.map((cell, index, cells) => {
                    /** CELL */

                    return getCell(cell, index, cells);
                  })}
              </tr>
            );
          })}
        {!props.rowVirtualEnabled &&
          props.rows.map((row) => {
            const visibleCells = row.getVisibleCells();

            /** ROW */
            return (
              <tr
                data-id="row"
                key={row.id}
                className={styles.row}
                data-index={row.index}
                ref={(node) => props.rowVirtualizer.measureElement(node)}
                onClick={(event) => {
                  props.onClickRow?.(row, event);
                }}
                onDoubleClick={(event) => {
                  props.onDoubleClickRow?.(row, event);
                }}
              >
                {props.columnVirtualEnabled && (
                  <>
                    {props.virtualPaddingLeft ? (
                      <td
                        data-id="cell"
                        style={{ display: "flex", width: props.virtualPaddingLeft }}
                      />
                    ) : null}
                    {props.columnsVirtual.map((virtualColumn) => {
                      /** CELL */
                      const cell = visibleCells[virtualColumn.index];

                      return getCell(cell, virtualColumn.index, visibleCells);
                    })}
                    {props.virtualPaddingRight ? (
                      <td
                        data-id="cell"
                        style={{ display: "flex", width: props.virtualPaddingRight }}
                      />
                    ) : null}
                  </>
                )}
                {!props.columnVirtualEnabled &&
                  visibleCells.map((cell, index, cells) => {
                    /** CELL */

                    return getCell(cell, index, cells);
                  })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
