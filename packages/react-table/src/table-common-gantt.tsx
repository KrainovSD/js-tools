import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import { useTableCell } from "./hooks";
import styles from "./table-common-gantt.module.scss";
import {
  GANTT_COMMON_TABLE_BODY_ID,
  GANTT_COMMON_TABLE_HEADER_ID,
  GANTT_HEADER_HEIGHT,
  GANTT_ROW_HEIGHT,
  GANTT_ROW_HEIGHT_MINI,
} from "./table.constants";
import type { RowInterface, TableInterface } from "./types";

type TableContainerProps<RowData extends Record<string, unknown>> = {
  gantt: boolean | undefined;
  width?: number;
  tableRef?: React.LegacyRef<HTMLTableElement>;
  ganttRowMini?: boolean;
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

export function TableCommonGantt<RowData extends Record<string, unknown>>(
  props: TableContainerProps<RowData>,
) {
  const { getCell, getHeader } = useTableCell<RowData>();

  return (
    <div
      ref={props.tableRef}
      className={styles.table}
      style={{
        width: props.width,
      }}
      data-id="table"
    >
      <div
        id={GANTT_COMMON_TABLE_HEADER_ID}
        className={clsx(
          styles.headerContainer,
          (props.frozenHeader || props.frozenHeader == undefined) && styles.headerContainer__frozen,
        )}
        data-id="header-container"
      >
        <div className={clsx(styles.header)} data-id="header">
          {props.table.getHeaderGroups().map((headerGroup) => {
            /** ROW HEADER */
            return (
              <div
                key={headerGroup.id}
                className={styles.headerRow}
                style={{
                  minHeight: props.gantt ? GANTT_HEADER_HEIGHT * 2 : undefined,
                  maxHeight: props.gantt ? GANTT_HEADER_HEIGHT * 2 : undefined,
                }}
                data-id="header-row"
              >
                {props.columnVirtualEnabled && (
                  <>
                    {props.virtualPaddingLeft ? (
                      <div
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
                      <div
                        style={{ display: "flex", width: props.virtualPaddingRight }}
                        data-id="header-cell"
                      />
                    ) : null}
                  </>
                )}
                {!props.columnVirtualEnabled && headerGroup.headers.map(getHeader)}
              </div>
            );
          })}
        </div>
      </div>
      <div
        data-id="body-container"
        className={styles.bodyContainer}
        id={GANTT_COMMON_TABLE_BODY_ID}
      >
        <div
          className={styles.body}
          style={{
            height: props.rowVirtualEnabled
              ? `${props.rowVirtualizer.getTotalSize()}px`
              : undefined,
            width: props.table.getTotalSize(),
          }}
          data-id="body"
        >
          {props.rowVirtualEnabled &&
            props.rowsVirtual.map((virtualRow) => {
              const row = props.rows[virtualRow.index];
              const visibleCells = row.getVisibleCells();

              /** ROW */
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  data-id="row"
                  key={row.id}
                  className={clsx(styles.row, styles.row__virtual)}
                  data-index={virtualRow.index}
                  ref={(node) => props.rowVirtualizer.measureElement(node)}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scrolls
                    minHeight: props.gantt
                      ? props.ganttRowMini
                        ? GANTT_ROW_HEIGHT_MINI
                        : GANTT_ROW_HEIGHT
                      : undefined,
                    maxHeight: props.gantt
                      ? props.ganttRowMini
                        ? GANTT_ROW_HEIGHT_MINI
                        : GANTT_ROW_HEIGHT
                      : undefined,
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
                        <div
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
                        <div
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
                </div>
              );
            })}
          {!props.rowVirtualEnabled &&
            props.rows.map((row) => {
              const visibleCells = row.getVisibleCells();

              /** ROW */
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
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
                  style={{
                    minHeight: props.gantt
                      ? props.ganttRowMini
                        ? GANTT_ROW_HEIGHT_MINI
                        : GANTT_ROW_HEIGHT
                      : undefined,
                    maxHeight: props.gantt
                      ? props.ganttRowMini
                        ? GANTT_ROW_HEIGHT_MINI
                        : GANTT_ROW_HEIGHT
                      : undefined,
                  }}
                >
                  {props.columnVirtualEnabled && (
                    <>
                      {props.virtualPaddingLeft ? (
                        <div
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
                        <div
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
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
