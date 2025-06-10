import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import styles from "./gantt.module.scss";
import { Scroll } from "./module/gantt/components";
import { GANTT_HEADER_HEIGHT } from "./module/gantt/gantt.constants";
import { useScroll, useSplitter } from "./module/gantt/hooks";
import { TableCommonGantt } from "./module/gantt/table-common-gantt";
import { TableGantt } from "./module/gantt/table-gantt";
import type {
  GanttInfo,
  GanttTaskProps,
  GanttTooltipProps,
  GanttViewType,
  HeaderInterface,
  RowInterface,
  TableInterface,
} from "./types";

export type GanttProps<
  RowData extends Record<string, unknown>,
  GanttData extends Record<string, unknown>,
> = {
  fullSize: boolean | undefined;
  tableContainerRef?: React.LegacyRef<HTMLDivElement>;
  columnVirtualEnabled: boolean;
  rowVirtualEnabled: boolean;
  table: TableInterface<RowData>;
  frozenHeader: boolean;
  columnsVirtual: VirtualItem[];
  rowsVirtual: VirtualItem[];
  rows: RowInterface<RowData>[];
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLElement>;
  onClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  onDoubleClickRow?: (row: RowInterface<RowData>, event: React.MouseEvent<HTMLElement>) => void;
  withGantt: boolean | undefined;
  ganttRowMini: boolean | undefined;
  instantGanttSplitter: boolean | undefined;
  firstGanttDate?: string;
  lastGanttDate?: string;
  ganttGrid?: boolean;
  ganttInfoGetter?: (row: RowInterface<RowData>) => GanttInfo<GanttData>;
  locale?: string;
  GanttTooltip: React.FC<GanttTooltipProps<RowData>> | undefined;
  rowClassName: ((row: RowInterface<RowData>) => string | undefined) | string | undefined;
  headerRowClassName:
    | ((header: HeaderInterface<RowData>) => string | undefined)
    | string
    | undefined;
  ganttView: GanttViewType;
  GanttTask: React.FC<GanttTaskProps<RowData, GanttData>> | undefined;
};

export function Gantt<
  RowData extends Record<string, unknown>,
  GanttData extends Record<string, unknown>,
>(props: GanttProps<RowData, GanttData>) {
  const { sizes, startDrag, splitterRef, isDragging, splitterGhostRef, splitterOverflowRef } =
    useSplitter(props.instantGanttSplitter);

  const { tableGanttRef, tableGanttScrollRef, tableRef, tableScrollRef } = useScroll();

  return (
    <>
      <div
        ref={props.tableContainerRef}
        className={clsx(
          styles.container,
          props.withGantt && styles.container__gantt,
          props.fullSize && styles.container_full,
        )}
        data-id={"container"}
      >
        <div className={styles.ganttContainer}>
          <TableCommonGantt
            rowHeaderHeight={
              props.ganttView === "months" || props.ganttView === "years"
                ? GANTT_HEADER_HEIGHT * 2
                : GANTT_HEADER_HEIGHT * 3
            }
            tableRef={tableRef}
            width={sizes[0]}
            columnVirtualEnabled={props.columnVirtualEnabled}
            rowVirtualEnabled={props.rowVirtualEnabled}
            columnsVirtual={props.columnsVirtual}
            rowsVirtual={props.rowsVirtual}
            frozenHeader={props.frozenHeader ?? true}
            rowVirtualizer={props.rowVirtualizer}
            rows={props.rows}
            table={props.table}
            virtualPaddingLeft={0}
            virtualPaddingRight={0}
            onClickRow={props.onClickRow}
            onDoubleClickRow={props.onDoubleClickRow}
            ganttRowMini={props.ganttRowMini}
            rowClassName={props.rowClassName}
            headerRowClassName={props.headerRowClassName}
          />
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div className={clsx(styles.splitter)} ref={splitterRef} onMouseDown={startDrag}>
            <div className={styles.splitter__trigger}></div>
            <div ref={splitterGhostRef} className={styles.splitter__ghost}></div>
          </div>
          {!props.instantGanttSplitter && (
            <div
              className={clsx(
                styles.splitter__overflowContainer,
                isDragging && styles.splitter__overflowContainer_active,
              )}
            >
              <div className={styles.splitter__overflow} ref={splitterOverflowRef}></div>
            </div>
          )}
          <TableGantt
            width={sizes[1]}
            tableRef={tableGanttRef}
            columnVirtualEnabled={props.columnVirtualEnabled}
            rowVirtualEnabled={props.rowVirtualEnabled}
            columnsVirtual={props.columnsVirtual}
            rowsVirtual={props.rowsVirtual}
            frozenHeader={props.frozenHeader ?? true}
            rowVirtualizer={props.rowVirtualizer}
            rows={props.rows}
            table={props.table}
            virtualPaddingLeft={0}
            virtualPaddingRight={0}
            onClickRow={props.onClickRow}
            onDoubleClickRow={props.onDoubleClickRow}
            firstGanttDate={props.firstGanttDate}
            lastGanttDate={props.lastGanttDate}
            ganttInfoGetter={props.ganttInfoGetter}
            ganttRowMini={props.ganttRowMini}
            GanttTooltip={props.GanttTooltip}
            ganttGrid={props.ganttGrid}
            locale={props.locale}
            ganttView={props.ganttView ?? "months"}
            GanttTask={props.GanttTask}
          />
        </div>
      </div>
      {props.withGantt && (
        <Scroll
          tableGanttScrollRef={tableGanttScrollRef}
          tableScrollRef={tableScrollRef}
          sizes={sizes}
        />
      )}
    </>
  );
}
